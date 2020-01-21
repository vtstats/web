import { differenceInMinutes, differenceInSeconds, parseISO } from "date-fns";
import * as admin from "firebase-admin";

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
  start: string;
  end?: string;
  avgViewers?: number;
  maxViewers?: number;
};

export class Database {
  private vtuberStatUpdatedAt: Date = new Date(0);

  private streamStatUpdatedAt: Date = new Date(0);
  private streamListUpdatedAt: Date = new Date(0);

  private vtubers: { [id: string]: VTuber } = {};
  private vtuberStats: { [id: string]: { [time: string]: number[] } } = {};

  private streams: { [id: string]: Stream } = {};
  private streamStats: { [id: string]: { [time: string]: number } } = {};

  async getVTubers(): Promise<{
    updatedAt: Date;
    vtubers: { [id: string]: VTuber };
  }> {
    if (differenceInMinutes(new Date(), this.vtuberStatUpdatedAt) >= 60) {
      await this.fetchVTubers();
    }
    return {
      updatedAt: this.vtuberStatUpdatedAt,
      vtubers: this.vtubers
    };
  }

  private async fetchVTubers() {
    const [updatedAt, vtubers] = await Promise.all([
      db.ref("/updatedAt/vtuberStat").once("value"),
      db.ref("/vtubers").once("value")
    ]);
    this.vtuberStatUpdatedAt = parseISO(updatedAt.val());
    this.vtubers = vtubers.val();

    writeLog({
      event: "database",
      value: "/updatedAt/vtuberStat",
      message: `val: ${updatedAt.val()}`
    });
    writeLog({
      event: "database",
      value: "/vtubers",
      message: `numChildren: ${vtubers.numChildren()}`
    });
  }

  async getVTuberStat(id: string): Promise<{ [time: string]: number[] }> {
    if (!this.vtuberStats[id]) {
      await this.fetchVTuberStat(id, "0");
    } else if (
      differenceInMinutes(new Date(), this.vtuberStatUpdatedAt) >= 60
    ) {
      const timestamps = Object.keys(this.vtuberStats[id]).sort((a, b) =>
        a > b ? -1 : 1
      );
      await this.fetchVTuberStat(id, timestamps[0]);
    }
    return this.vtuberStats[id];
  }

  private async fetchVTuberStat(id: string, startAt: string) {
    const [updatedAt, stats] = await Promise.all([
      db.ref("/updatedAt/vtuberStat").once("value"),
      db
        .ref(`/vtuberStats/${id}`)
        .orderByKey()
        .startAt(startAt)
        .once("value")
    ]);
    this.vtuberStatUpdatedAt = parseISO(updatedAt.val());
    this.vtuberStats[id] = { ...this.vtuberStats[id], ...stats.val() };

    writeLog({
      event: "database",
      value: "/updatedAt/vtuberStat",
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
    if (differenceInMinutes(new Date(), this.streamListUpdatedAt) >= 5) {
      await this.fetchStreams(this.streamListUpdatedAt);
    }
    return {
      updatedAt: this.streamListUpdatedAt,
      streams: this.streams
    };
  }

  private async fetchStreams(startAt: Date) {
    const [updatedAt, streams] = await Promise.all([
      db.ref("/updatedAt/streamList").once("value"),
      db
        .ref("/streams")
        .orderByChild("start")
        .startAt(startAt.toISOString())
        .once("value")
    ]);
    this.streamListUpdatedAt = parseISO(updatedAt.val());
    this.streams = { ...this.streams, ...streams.val() };

    writeLog({
      event: "database",
      value: "/updatedAt/streamList",
      message: `val: ${updatedAt.val()}`
    });
    writeLog({
      event: "database",
      value: "/streams",
      message: `startAt: ${startAt.toISOString()} numChildren: ${streams.numChildren()}`
    });
  }

  async getStreamStat(id: string): Promise<{ [time: string]: number }> {
    if (!this.streamStats[id]) {
      await this.fetchStreamStat(id, "0");
    } else if (
      differenceInSeconds(new Date(), this.streamStatUpdatedAt) >= 20
    ) {
      const timestamps = Object.keys(this.streamStats[id]).sort((a, b) =>
        a > b ? -1 : 1
      );
      await this.fetchStreamStat(id, timestamps[0]);
    }
    return this.streamStats[id];
  }

  private async fetchStreamStat(id: string, startAt: string) {
    const [updatedAt, stats] = await Promise.all([
      db.ref("/updatedAt/streamStat").once("value"),
      db
        .ref(`/streamStats/${id}`)
        .orderByKey()
        .startAt(startAt)
        .once("value")
    ]);
    this.streamStatUpdatedAt = parseISO(updatedAt.val());
    this.streamStats[id] = { ...this.streamStats[id], ...stats.val() };

    writeLog({
      event: "database",
      value: "/updatedAt/streamStat",
      message: `val: ${updatedAt.val()}`
    });
    writeLog({
      event: "database",
      value: `/streamStats/${id}`,
      message: `startAt: ${startAt} numChildren: ${stats.numChildren()}`
    });
  }
}
