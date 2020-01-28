import {
  differenceInMinutes,
  differenceInSeconds,
  parseISO,
  isAfter
} from "date-fns";
import * as admin from "firebase-admin";
import { youtube_v3 } from "googleapis";

import vtubers from "../../vtubers.json";
import { writeLog } from "./logging";

admin.initializeApp();

const db = admin.database();

export type VTuber = {
  id: string;
  bilibili: number;
  name: string;
  twitter: string;
  youtube: string;
  bilibiliStats: {
    subs: number;
    views: number;
    dailySubs: number;
    dailyViews: number;
    weeklySubs: number;
    weeklyViews: number;
    monthlySubs: number;
    monthlyViews: number;
  };
  youtubeStats: {
    subs: number;
    views: number;
    dailySubs: number;
    dailyViews: number;
    weeklySubs: number;
    weeklyViews: number;
    monthlySubs: number;
    monthlyViews: number;
  };
};

export type Stream = {
  id: string;
  title: string;
  vtuberId: string;
  schedule?: string;
  start?: string;
  end?: string;
  status?: "schedule" | "live" | "end";
  avgViewers?: number;
  maxViewers?: number;
};

export class Database {
  private channelUpdatedAt: Date = new Date(0);

  private vtubers: { [id: string]: VTuber } = {};
  private channelStats: { [id: string]: { [time: string]: number[] } } = {};

  private streamUpdatedAt: Date = new Date(0);

  private streams: { [id: string]: Stream } = {};
  private streamStats: { [id: string]: { [time: string]: number } } = {};

  async getVTubers(): Promise<{
    updatedAt: Date;
    vtubers: { [id: string]: VTuber };
  }> {
    const updatedAt = parseISO(
      (await db.ref("/updatedAt/channels").once("value")).val()
    );

    if (isAfter(updatedAt, this.channelUpdatedAt)) {
      const vtubers = await db.ref("/vtubers").once("value");

      this.vtubers = vtubers.val();

      writeLog({
        event: "database",
        value: "/vtubers",
        message: `numChildren: ${vtubers.numChildren()}`
      });
    }

    this.channelUpdatedAt = updatedAt;

    return {
      updatedAt: this.channelUpdatedAt,
      vtubers: this.vtubers
    };
  }

  async getChannelStat(id: string): Promise<{ [time: string]: number[] }> {
    if (!this.channelStats[id]) {
      await this.fetchChannelStat(id, "0");
    } else if (differenceInMinutes(new Date(), this.channelUpdatedAt) >= 60) {
      const timestamps = Object.keys(this.channelStats[id]).sort((a, b) =>
        a > b ? -1 : 1
      );
      await this.fetchChannelStat(id, timestamps[0]);
    }
    return this.channelStats[id];
  }

  private async fetchChannelStat(id: string, startAt: string) {
    const [updatedAt, stats] = await Promise.all([
      db.ref("/updatedAt/channels").once("value"),
      db
        .ref(`/vtuberStats/${id}`)
        .orderByKey()
        .startAt(startAt)
        .once("value")
    ]);
    this.channelUpdatedAt = parseISO(updatedAt.val());
    this.channelStats[id] = { ...this.channelStats[id], ...stats.val() };

    writeLog({
      event: "database",
      value: "/updatedAt/channels",
      message: `val: ${updatedAt.val()}`
    });
    writeLog({
      event: "database",
      value: `/vtuberStats/${id}`,
      message: `startAt: ${startAt} numChildren: ${stats.numChildren()}`
    });
  }

  async getStreams(): Promise<{
    updatedAt: Date;
    streams: { [id: string]: Stream };
  }> {
    const updatedAt = parseISO(
      (await db.ref("/updatedAt/streams").once("value")).val()
    );

    if (isAfter(updatedAt, this.streamUpdatedAt)) {
      if (Object.keys(this.streams).length > 0) {
        const [ended, current] = await Promise.all([
          db
            .ref("/streams")
            .orderByChild("end")
            .startAt(this.streamUpdatedAt.toISOString())
            .once("value"),
          db
            .ref("/streams")
            .orderByChild("status")
            .equalTo("live")
            .once("value")
        ]);
        this.streams = { ...this.streams, ...ended.val(), ...current.val() };

        writeLog({
          event: "database",
          value: "/streams",
          message:
            "startAt: " +
            this.streamUpdatedAt.toISOString() +
            " ended.numChildren: " +
            ended.numChildren() +
            " current.numChildren: " +
            current.numChildren()
        });
      } else {
        this.streams = (await db.ref("/streams").once("value")).val();

        writeLog({ event: "database", value: "/streams" });
      }
    }

    this.streamUpdatedAt = updatedAt;

    return {
      updatedAt: this.streamUpdatedAt,
      streams: this.streams
    };
  }

  async getStreamStat(id: string): Promise<{ [time: string]: number }> {
    if (!this.streamStats[id]) {
      await this.fetchStreamStat(id, "0");
    } else if (differenceInSeconds(new Date(), this.streamUpdatedAt) >= 20) {
      const timestamps = Object.keys(this.streamStats[id]).sort((a, b) =>
        a > b ? -1 : 1
      );
      await this.fetchStreamStat(id, timestamps[0]);
    }
    return this.streamStats[id];
  }

  private async fetchStreamStat(id: string, startAt: string) {
    const [updatedAt, stats] = await Promise.all([
      db.ref("/updatedAt/streams").once("value"),
      db
        .ref(`/streamStats/${id}`)
        .orderByKey()
        .startAt(startAt)
        .once("value")
    ]);
    this.streamUpdatedAt = parseISO(updatedAt.val());
    this.streamStats[id] = { ...this.streamStats[id], ...stats.val() };

    writeLog({
      event: "database",
      value: "/updatedAt/streams",
      message: `val: ${updatedAt.val()}`
    });
    writeLog({
      event: "database",
      value: `/streamStats/${id}`,
      message: `startAt: ${startAt} numChildren: ${stats.numChildren()}`
    });
  }

  async addScheduleStream(video: youtube_v3.Schema$Video) {
    if (
      video.snippet &&
      video.liveStreamingDetails &&
      video.liveStreamingDetails.scheduledStartTime &&
      !video.liveStreamingDetails.actualStartTime
    ) {
      const stream: Stream = {
        id: video.id || "unknown",
        title: video.snippet.title || "unknown",
        vtuberId: this.findIdByChannel(video.snippet.channelId || "unknown"),
        schedule: video.liveStreamingDetails.scheduledStartTime,
        status: "schedule"
      };

      await db.ref(`/streams/${stream.id}`).set(stream);

      this.streams[stream.id] = stream;

      const now = new Date();

      await db.ref("/updatedAt/streams").set(now.toISOString());

      writeLog({
        event: "database",
        value: `/streams/${stream.id}`,
        message: `vtuberId: ${stream.vtuberId} schedule: ${stream.schedule}`
      });
    }
  }

  private findIdByChannel(channel: string): string {
    for (const group of vtubers.items) {
      for (const member of group.members) {
        if (member.youtube == channel) return member.id;
      }
    }
    return "unknown";
  }
}
