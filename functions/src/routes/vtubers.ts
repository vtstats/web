import * as express from "express";
import * as cors from "cors";
import { getUnixTime, subDays } from "date-fns";
import { VTUBERS } from "../const";

import { isAuthenticated } from "../middlewares";
import { db } from "../api";

const VTUBER_IDS = VTUBERS.map(v => v.id);

export const router = express.Router();

const vtubersRef = db.ref("vtubers");

router.get("/", cors({ origin: true }), async (req, res) => {
  if (req.query.ids && typeof req.query.ids == "string") {
    const ids = req.query.ids.split(",");
    const vtubers: any[] = [];
    let updatedAt = new Date();
    (await vtubersRef.once("value")).forEach(snap => {
      const val = snap.val();
      if (snap.key == "updatedAt") {
        updatedAt = val;
      } else if (ids.includes(val.id)) {
        vtubers.push(val);
      }
    });
    res.json({ vtubers, updatedAt });
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
    res.json({
      ...data[0],
      youtubeViews: data[1],
      youtubeSubs: data[2],
      bilibiliViews: data[3],
      bilibiliSubs: data[4]
    });
  } else {
    res.json({});
  }
});

router.post("/update", isAuthenticated, async (_, res) => {
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
  let fields = {};
  VTUBER_IDS.forEach((id, i) => {
    fields = {
      ...fields,
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
  await vtubersRef.update(fields);
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
