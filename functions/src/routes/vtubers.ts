import * as express from "express";
import * as cors from "cors";
import { getUnixTime, subDays } from "date-fns";

import { VTUBERS } from "../const";
import { isAuthenticated } from "../middlewares";
import { db } from "../admin";
import { listChannels } from "../youtube";
import {
  VTubersResponse,
  VTuberDetailResponse,
  VTubersUpdateRequest
} from "../models";

const VTUBER_IDS = VTUBERS.map(v => v.id);

export const router = express.Router();

const statsRef = db.ref("stats");
const vtubersRef = db.ref("vtubers");

router.get("/", cors({ origin: true }), async (req, res) => {
  if (req.query.ids && typeof req.query.ids == "string") {
    const ids = req.query.ids.split(",");
    const response: VTubersResponse = { updatedAt: new Date(), vtubers: [] };
    (await vtubersRef.once("value")).forEach(snap => {
      if (snap.key == "_updatedAt") {
        response.updatedAt = snap.val();
      } else if (ids.includes(snap.key)) {
        response.vtubers.push(snap.val());
      }
    });
    res.json(response);
  } else {
    res.json({ vtubers: [] });
  }
});

router.get("/:id", cors({ origin: true }), async (req, res) => {
  const id = req.params.id;
  if (VTUBER_IDS.includes(id)) {
    const data = await Promise.all([
      db
        .ref(`/vtubers/${id}`)
        .once("value")
        .then(snap => snap.val()),
      queryStats(`/stats/youtubeViews/${id}`),
      queryStats(`/stats/youtubeSubs/${id}`),
      queryStats(`/stats/bilibiliViews/${id}`),
      queryStats(`/stats/bilibiliSubs/${id}`)
    ]);
    const response: VTuberDetailResponse = {
      ...data[0],
      youtubeViews: data[1],
      youtubeSubs: data[2],
      bilibiliViews: data[3],
      bilibiliSubs: data[4]
    };
    res.json(response);
  } else {
    res.json({});
  }
});

router.post("/update", isAuthenticated, async (req, res) => {
  const body: VTubersUpdateRequest = req.body;
  const now = getUnixTime(new Date());

  const channels = await listChannels(VTUBER_IDS);

  let statsFields: { [path: string]: number } = {};

  for (const channel of channels) {
    const vtuber: any = VTUBERS.find(v => v.youtube == channel.id);
    const youtubeViews = parseInt(channel.statistics.viewCount);
    const youtubeSubs = parseInt(channel.statistics.subscriberCount);

    statsFields = {
      ...statsFields,
      [`youtubeViews/${vtuber.id}/${now}`]: youtubeViews,
      [`youtubeSubs/${vtuber.id}/${now}`]: youtubeSubs
    };
  }

  for (const stat of body) {
    statsFields = {
      ...statsFields,
      [`bilibiliViews/${stat.id}/${now}`]: stat.views,
      [`bilibiliSubs/${stat.id}/${now}`]: stat.subs
    };
  }

  await statsRef.update(statsFields);

  const promises: Promise<number>[] = [];
  for (const id of VTUBER_IDS) {
    promises.push(getNewest(`/stats/bilibiliSubs/${id}`));
    promises.push(getOneDayAgo(`/stats/bilibiliSubs/${id}`));
    promises.push(getNewest(`/stats/bilibiliViews/${id}`));
    promises.push(getOneDayAgo(`/stats/bilibiliViews/${id}`));
    promises.push(getNewest(`/stats/youtubeSubs/${id}`));
    promises.push(getOneDayAgo(`/stats/youtubeSubs/${id}`));
    promises.push(getNewest(`/stats/youtubeViews/${id}`));
    promises.push(getOneDayAgo(`/stats/youtubeViews/${id}`));
  }
  const result = await Promise.all(promises);

  let vtuberFields: { [path: string]: number } = { _updatedAt: now };

  VTUBER_IDS.forEach((id, i) => {
    vtuberFields = {
      ...vtuberFields,
      [`${id}/bilibiliStats/dailySubs`]: result[i * 8] - result[i * 8 + 1],
      [`${id}/bilibiliStats/subs`]: result[i * 8],
      [`${id}/bilibiliStats/dailyViews`]: result[i * 8 + 2] - result[i * 8 + 3],
      [`${id}/bilibiliStats/views`]: result[i * 8 + 2],
      [`${id}/youtubeStats/dailySubs`]: result[i * 8 + 4] - result[i * 8 + 5],
      [`${id}/youtubeStats/subs`]: result[i * 8 + 4],
      [`${id}/youtubeStats/dailyViews`]: result[i * 8 + 6] - result[i * 8 + 7],
      [`${id}/youtubeStats/views`]: result[i * 8 + 6]
    };
  });

  await vtubersRef.update(vtuberFields);

  res.send(`Updated ${VTUBER_IDS.length} VTubers status.`);
});

async function queryStats(path: string): Promise<{ [time: string]: number }> {
  return db
    .ref(path)
    .once("value")
    .then(snap => snap.val());
}

async function getOneDayAgo(path: string): Promise<number> {
  return db
    .ref(path)
    .orderByKey()
    .startAt(getUnixTime(subDays(new Date(), 1)).toString())
    .limitToFirst(1)
    .once("value")
    .then(snap => snap.val())
    .then(obj => obj[Object.keys(obj)[0]]);
}

async function getNewest(path: string): Promise<number> {
  return db
    .ref(path)
    .orderByKey()
    .limitToLast(1)
    .once("value")
    .then(snap => snap.val())
    .then(obj => obj[Object.keys(obj)[0]]);
}
