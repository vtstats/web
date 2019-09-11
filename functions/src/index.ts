import * as cors from "cors";
import * as express from "express";
import * as functions from "firebase-functions";

import { Database } from "./database";
import {
  StreamsListResponse,
  StreamDetailResponse,
  VTubersListResponse,
  VTuberDetailResponse
} from "./models";

const app = express();
const db = new Database();

app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: "GET"
  })
);

app.get("/api/vtubers", async (req, res) => {
  let ids: string[] = [];
  if (req.query.ids && typeof req.query.ids == "string") {
    ids = req.query.ids.split(",");
  }

  await db.updateCache();

  res.set("Last-Modified", db.vtubers.updatedAt.toUTCString());

  if (req.fresh) {
    res.status(304).end();
  } else {
    res.json({
      updatedAt: db.vtubers.updatedAt.toISOString(),
      vtubers: db.vtubers.items.filter(v => ids.includes(v.id))
    } as VTubersListResponse);
  }
});

app.get("/api/vtubers/:id", async (req, res) => {
  const id = req.params.id;

  await db.updateCache();

  res.set("Last-Modified", db.vtubers.updatedAt.toUTCString());

  if (req.fresh) {
    res.status(304).end();
  } else {
    res.json({
      ...db.findVTuber(id),
      stats: await db.vtuberStats(id)
    } as VTuberDetailResponse);
  }
});

app.get("/api/streams", async (req, res) => {
  let ids: string[] = [];
  if (req.query.ids && typeof req.query.ids == "string") {
    ids = req.query.ids.split(",");
  }

  await db.updateCache();

  res.set("Last-Modified", db.streams.updatedAt.toUTCString());

  if (req.fresh) {
    res.status(304).end();
  } else {
    const streams = [];

    const index = req.query.skip
      ? db.streams.items.findIndex(s => s.id == req.query.skip) + 1
      : 0;

    for (const stream of db.streams.items.slice(index)) {
      if (streams.length == 24) {
        break;
      } else if (ids.includes(stream.vtuberId)) {
        streams.push(stream);
      }
    }

    res.json({
      updatedAt: db.streams.updatedAt.toISOString(),
      streams
    } as StreamsListResponse);
  }
});

app.get("/api/streams/:id", async (req, res) => {
  const id = req.params.id;

  await db.updateCache();

  res.json({
    ...db.findStream(id),
    stats: await db.streamStats(id)
  } as StreamDetailResponse);
});

export const api = functions.https.onRequest(app);
