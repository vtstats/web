import * as express from "express";
import { differenceInMinutes, parseISO } from "date-fns";

import { db } from "../admin";
import { Stream, StreamsListResponse, StreamDetailResponse } from "../models";

export const router = express.Router();

const cache = { updatedAt: new Date(0), streams: [] as Stream[] };

router.get("/", async (req, res) => {
  let ids: string[] = [];
  if (req.query.ids && typeof req.query.ids == "string") {
    ids = req.query.ids.split(",");
  }

  if (differenceInMinutes(new Date(), cache.updatedAt) > 10) {
    let query = await db
      .ref("/streams")
      .orderByChild("start")
      .once("value");
    cache.streams = [];
    query.forEach(snap => {
      if (snap.key == "_updatedAt") {
        cache.updatedAt = parseISO(snap.val());
      } else if (snap.key != "_current") {
        cache.streams.push(snap.val());
      }
    });
    console.info("Streams", "cache updated");
  }

  const filtered = cache.streams.filter(s => ids.includes(s.vtuberId));

  const response: StreamsListResponse = {
    updatedAt: cache.updatedAt.toISOString(),
    streams: filtered,
    total: filtered.length
  };

  res.json(response);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const [info, stats] = await Promise.all([
    db.ref(`/streams/${id}`).once("value"),
    db.ref(`/streamStats/${id}`).once("value")
  ]);
  const response: StreamDetailResponse = {
    ...info.val(),
    stats: stats.val()
  };
  res.json(response);
});
