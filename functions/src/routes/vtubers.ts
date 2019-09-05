import * as express from "express";
import { differenceInMinutes, parseISO } from "date-fns";

import { db } from "../admin";
import { VTubersListResponse, VTuberDetailResponse, VTuber } from "../models";

const cache = { updatedAt: new Date(0), vtubers: [] as VTuber[] };

async function updateCache() {
  if (differenceInMinutes(new Date(), cache.updatedAt) > 30) {
    console.time("Update VTuber cache");
    let query = await db.ref("/vtubers").once("value");
    cache.vtubers = [];
    query.forEach(snap => {
      if (snap.key == "_updatedAt") {
        cache.updatedAt = parseISO(snap.val());
      } else {
        cache.vtubers.push(snap.val());
      }
    });
    console.timeEnd("Update VTuber cache");
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
    const filtered = cache.vtubers.filter(v => ids.includes(v.id));

    const response: VTubersListResponse = {
      updatedAt: cache.updatedAt.toISOString(),
      vtubers: filtered
    };

    res.json(response);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const [, stats] = await Promise.all([
    updateCache(),
    db.ref(`/vtuberStats/${id}`).once("value")
  ]);

  const response: VTuberDetailResponse = {
    ...(cache.vtubers.find(v => v.id == id) as VTuber),
    stats: stats.val()
  };
  res.json(response);
});
