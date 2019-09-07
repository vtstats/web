import * as express from "express";
import { differenceInMinutes, parseISO, compareDesc } from "date-fns";

import { db } from "../admin";
import { Stream, StreamsListResponse, StreamDetailResponse } from "../models";

const cache = { updatedAt: new Date(0), streams: [] as Stream[] };

async function updateCache() {
  if (differenceInMinutes(new Date(), cache.updatedAt) > 10) {
    console.time("Update Stream cache");
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
    cache.streams.sort((a, b) =>
      compareDesc(parseISO(a.start), parseISO(b.start))
    );
    console.timeEnd("Update Stream cache");
  }
}

export const router = express.Router();

router.get("/", async (req, res) => {
  let ids: string[] = [];
  if (req.query.ids && typeof req.query.ids == "string") {
    ids = req.query.ids.split(",");
  }

  await updateCache();

  res.set("Last-Modified", cache.updatedAt.toUTCString());

  if (req.fresh) {
    res.status(304).end();
  } else {
    const streams = [];

    const index = req.query.skip
      ? cache.streams.findIndex(stream => stream.id == req.query.skip) + 1
      : 0;

    for (const stream of cache.streams.slice(index)) {
      if (streams.length == 24) {
        break;
      } else if (ids.includes(stream.vtuberId)) {
        streams.push(stream);
      }
    }

    const response: StreamsListResponse = {
      updatedAt: cache.updatedAt.toISOString(),
      streams
    };

    res.json(response);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const [, stats] = await Promise.all([
    updateCache(),
    db.ref(`/streamStats/${id}`).once("value")
  ]);
  const response: StreamDetailResponse = {
    ...(cache.streams.find(s => s.id == id) as Stream),
    stats: stats.val()
  };
  res.json(response);
});
