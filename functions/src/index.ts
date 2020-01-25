import cors from "cors";
import {
  compareDesc,
  getUnixTime,
  isAfter,
  isBefore,
  parseISO
} from "date-fns";
import express from "express";
import * as functions from "firebase-functions";

import { Database } from "./database";
import { writeLog } from "./logging";
import {
  validate,
  validateEndAtQuery,
  validateIdParam,
  validateIdsQuery,
  validateStartAtQuery
} from "./validate";

const app = express();
const db = new Database();

app.use(cors({ origin: "http://localhost:4200", methods: "GET" }));

app.get(
  "/api_v2/youtube_channel",
  validate([validateIdsQuery]),
  async (req, res) => {
    const ids: string[] = req.query.ids;

    const { updatedAt, vtubers } = await db.getVTubers();

    const filtered = ids.map(id => ({
      id,
      subs: vtubers[id].youtubeStats.subs,
      dailySubs: vtubers[id].youtubeStats.dailySubs,
      weeklySubs: vtubers[id].youtubeStats.weeklySubs,
      monthlySubs: vtubers[id].youtubeStats.monthlySubs,
      views: vtubers[id].youtubeStats.views,
      dailyViews: vtubers[id].youtubeStats.dailyViews,
      weeklyViews: vtubers[id].youtubeStats.weeklyViews,
      monthlyViews: vtubers[id].youtubeStats.monthlyViews
    }));

    res.json({ updatedAt: updatedAt.toISOString(), channels: filtered });

    writeLog({
      event: "http",
      value: "/api_v2/youtube_channel",
      message: `ids: ${ids}`
    });
  }
);

app.get(
  "/api_v2/bilibili_channel",
  validate([validateIdsQuery]),
  async (req, res) => {
    const ids: string[] = req.query.ids;

    const { updatedAt, vtubers } = await db.getVTubers();

    const filtered = ids.map(id => ({
      id,
      subs: vtubers[id].bilibiliStats.subs,
      dailySubs: vtubers[id].bilibiliStats.dailySubs,
      weeklySubs: vtubers[id].bilibiliStats.weeklySubs,
      monthlySubs: vtubers[id].bilibiliStats.monthlySubs,
      views: vtubers[id].bilibiliStats.views,
      dailyViews: vtubers[id].bilibiliStats.dailyViews,
      weeklyViews: vtubers[id].bilibiliStats.weeklyViews,
      monthlyViews: vtubers[id].bilibiliStats.monthlyViews
    }));

    res.json({ updatedAt: updatedAt.toISOString(), channels: filtered });

    writeLog({
      event: "http",
      value: "/api_v2/bilibili_channel",
      message: `ids: ${ids}`
    });
  }
);

app.get(
  "/api_v2/vtuber/:id",
  validate([validateIdParam, validateStartAtQuery, validateEndAtQuery]),
  async (req, res) => {
    const id: string = req.params.id;
    const startAt: Date = req.query.startAt;
    const endAt: Date = req.query.endAt;

    const startTimestamp = getUnixTime(startAt).toString();
    const endTimestamp = getUnixTime(endAt).toString();

    const { vtubers } = await db.getVTubers();
    const stats = await db.getVTuberStat(id);

    const filtered = Object.keys(stats)
      .filter(key => startTimestamp <= key && key <= endTimestamp)
      .reduce((obj, key) => ({ ...obj, [key]: stats[key] }), {});

    res.json({ vtuber: vtubers[id], series: filtered });

    writeLog({
      event: "http",
      value: `/api_v2/vtuber/${id}`,
      message: `startAt: ${startAt.toISOString()}, endAt: ${endAt.toISOString()}`
    });
  }
);

app.get(
  "/api_v2/youtube_stream",
  validate([validateIdsQuery, validateStartAtQuery, validateEndAtQuery]),
  async (req, res) => {
    const ids: string[] = req.query.ids;
    const startAt: Date = req.query.startAt;
    const endAt: Date = req.query.endAt;

    const { streams, updatedAt } = await db.getStreams();

    const filtered = Object.values(streams)
      .filter(stream => ids.includes(stream.vtuberId))
      .filter(
        stream =>
          isAfter(parseISO(stream.start), startAt) &&
          isBefore(parseISO(stream.start), endAt)
      )
      .sort((a, b) => compareDesc(parseISO(a.start), parseISO(b.start)));

    res.json({
      updatedAt: updatedAt.toISOString(),
      streams: filtered.slice(0, 24),
      hasMore: filtered.length > 24
    });

    writeLog({
      event: "http",
      value: "/api_v2/youtube_stream",
      message: `ids: ${ids}, startAt: ${startAt.toISOString()}, endAt: ${endAt.toISOString()}`
    });
  }
);

app.get("/api_v2/stream/:id", validate([validateIdParam]), async (req, res) => {
  const id: string = req.params.id;

  const { streams } = await db.getStreams();
  const stats = await db.getStreamStat(id);

  res.json({ stream: streams[id], series: stats });

  writeLog({
    event: "http",
    value: `/api_v2/stream/${id}`
  });
});

export const api_v2 = functions.https.onRequest(app);
