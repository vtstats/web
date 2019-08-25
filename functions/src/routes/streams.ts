import * as express from "express";
import * as cors from "cors";
import { differenceInMinutes, getUnixTime } from "date-fns";

import { VTUBERS } from "../const";
import { db, youtube } from "../api";
import { isAuthenticated } from "../middlewares";

const streamsRef = db.ref("streams");
const viewerStatsRef = db.ref("stats/viewers");

let liveStreams: string[] = [];

export const router = express.Router();

router.get("/", cors({ origin: true }), async (req, res) => {
  const result: any[] = [];
  if (req.query.ids && typeof req.query.ids == "string") {
    const ids = req.query.ids.split(",");
    const data = await streamsRef
      .orderByChild("scheduledStartTime")
      .once("value");
    data.forEach(d => {
      const val = d.val();
      if (ids.includes(val.vtuberId)) {
        result.push(val);
      }
    });
  }
  res.json(result);
});

router.get("/:id", cors({ origin: true }), async (req, res) => {
  const id = req.params.id;
  const data = await db.ref(`stats/viewers/${id}`).once("value");
  res.json(data.val());
});

router.post("/", isAuthenticated, async (req, res) => {
  if (req.body.videoIds) {
    const videos: any = await youtube.videos.list({
      part: "id,liveStreamingDetails,snippet",
      id: req.body.videoIds.join(",")
    });

    let fields = {};

    for (const item of videos.data.items) {
      if (
        !liveStreams.includes(item.id) &&
        "liveStreamingDetails" in item &&
        !("actualEndTime" in item.liveStreamingDetails) &&
        "scheduledStartTime" in item.liveStreamingDetails &&
        differenceInMinutes(
          new Date(item.liveStreamingDetails.scheduledStartTime),
          new Date()
        ) < 10
      ) {
        liveStreams.push(item.id);
        fields = {
          ...fields,
          [item.id]: {
            vtuberId: (VTUBERS.find(
              v => v.youtube == item.snippet.channelId
            ) as any).id,
            videoId: item.id,
            channelId: item.snippet.channelId,
            title: item.snippet.title
          }
        };
      }
    }

    await streamsRef.update(fields);
  }
  res.sendStatus(200);
});

router.post("/update", isAuthenticated, async (_, res) => {
  if (liveStreams.length > 0) {
    const videos: any = await youtube.videos.list({
      part: "id,liveStreamingDetails",
      id: liveStreams.join(",")
    });

    const now = getUnixTime(new Date());

    let viewersFields = {};
    let streamsFields = {};

    for (const item of videos.data.items) {
      const id = item.id;
      if ("actualEndTime" in item.liveStreamingDetails) {
        // TODO:
        liveStreams = liveStreams.filter(id => id != item.id);
        streamsFields = {
          ...streamsFields,
          [`${id}/actualStartTime`]: item.liveStreamingDetails.actualStartTime,
          [`${id}/actualEndTime`]: item.liveStreamingDetails.actualEndTime
        };
      } else if ("concurrentViewers" in item.liveStreamingDetails) {
        viewersFields = {
          ...viewersFields,
          [`${id}/${now}`]: item.liveStreamingDetails.concurrentViewers
        };
      }
    }

    await Promise.all([
      streamsRef.update(streamsFields),
      viewerStatsRef.update(viewersFields)
    ]);

    res.sendStatus(200);
  } else {
    res.sendStatus(200);
  }
});
