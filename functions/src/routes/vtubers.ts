import * as express from "express";
import { differenceInMinutes, parseISO } from "date-fns";

import { db } from "../admin";
import { VTubersListResponse, VTuberDetailResponse, VTuber } from "../models";

export const router = express.Router();

const cache = { updatedAt: new Date(0), vtubers: [] as VTuber[] };

router.get("/", async (req, res) => {
  let ids: string[] = [];
  if (req.query.ids && typeof req.query.ids == "string") {
    ids = req.query.ids.split(",");
  }

  if (differenceInMinutes(new Date(), cache.updatedAt) > 30) {
    let query = await db.ref("/vtubers").once("value");
    cache.vtubers = [];
    query.forEach(snap => {
      if (snap.key == "_updatedAt") {
        cache.updatedAt = parseISO(snap.val());
      } else {
        cache.vtubers.push(snap.val());
      }
    });
    console.info("VTuber", "cache updated");
  }

  const filtered = cache.vtubers.filter(v => ids.includes(v.id));

  const response: VTubersListResponse = {
    total: filtered.length,
    updatedAt: cache.updatedAt.toISOString(),
    vtubers: filtered
  };

  res.json(response);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const [info, stats] = await Promise.all([
    db.ref(`/vtubers/${id}`).once("value"),
    db.ref(`/vtuberStats/${id}`).once("value")
  ]);

  let youtubeSubs: { [time: string]: number } = {};
  let youtubeViews: { [time: string]: number } = {};
  let bilibiliSubs: { [time: string]: number } = {};
  let bilibiliViews: { [time: string]: number } = {};

  stats.forEach(snap => {
    const val = snap.val();
    let key = snap.key as string;
    youtubeSubs = { ...youtubeSubs, [key]: val[0] };
    youtubeViews = { ...youtubeViews, [key]: val[1] };
    bilibiliSubs = { ...bilibiliSubs, [key]: val[2] };
    bilibiliViews = { ...bilibiliViews, [key]: val[3] };
  });

  const response: VTuberDetailResponse = {
    ...info.val(),
    youtubeViews,
    youtubeSubs,
    bilibiliViews,
    bilibiliSubs
  };
  res.json(response);
});
