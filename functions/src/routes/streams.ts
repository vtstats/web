import * as express from "express";
import * as cors from "cors";
import { differenceInMinutes, getUnixTime } from "date-fns";

import { db } from "../admin";
import { isAuthenticated } from "../middlewares";
import { listVideos } from "../youtube";
import {
  StreamsResponse,
  StreamDetailResponse,
  StreamsUpdateRequest
} from "../models";

const streamsRef = db.ref("streams");
const rootRef = db.ref("/");

let liveStreams: string[] = [];

export const router = express.Router();

router.get("/", cors({ origin: true }), async (req, res) => {
  const response: StreamsResponse = { updatedAt: new Date(), streams: [] };
  if (req.query.ids && typeof req.query.ids == "string") {
    const ids = req.query.ids.split(",");
    const data = await streamsRef
      .orderByChild("scheduledStartTime")
      .once("value");
    data.forEach(snap => {
      const val = snap.val();
      if (snap.key == "_updatedAt") {
        response.updatedAt = val;
      } else if (ids.includes(val.vtuberId)) {
        response.streams.push(val);
      }
    });
  }
  res.json(response);
});

router.get("/:id", cors({ origin: true }), async (req, res) => {
  const id = req.params.id;
  const [info, stats] = await Promise.all([
    db.ref(`streams/${id}`).once("value"),
    db.ref(`stats/viewers/${id}`).once("value")
  ]);
  const response: StreamDetailResponse = {
    ...info.val(),
    stats: stats.val()
  };
  res.json(response);
});

router.post("/", isAuthenticated, async (req, res) => {
  const body: StreamsUpdateRequest = req.body;
  const videos = await listVideos(body.map(v => v.id));

  let fields = { _updatedAt: getUnixTime(new Date()) };

  for (const video of videos) {
    if (
      !liveStreams.includes(video.id) &&
      video.liveStreamingDetails &&
      !video.liveStreamingDetails.actualEndTime &&
      video.liveStreamingDetails.scheduledStartTime &&
      differenceInMinutes(
        new Date(video.liveStreamingDetails.scheduledStartTime),
        new Date()
      ) < 10
    ) {
      const item = body.find(v => v.id == video.id);
      if (item) {
        liveStreams.push(item.id);
        fields = {
          ...fields,
          [item.id]: {
            vtuberId: item.vtuber,
            videoId: item.id,
            title: item.title
          }
        };
      }
    }
  }

  await streamsRef.update(fields);

  res.send(
    `Live Streams queue updated, there are ${liveStreams.length} items in queue.`
  );
});

router.post("/update", isAuthenticated, async (_, res) => {
  if (liveStreams.length > 0) {
    const videos = await listVideos(liveStreams);

    const now = getUnixTime(new Date());

    let fields = {};

    for (const video of videos) {
      const id = video.id;
      if (
        video.liveStreamingDetails &&
        video.liveStreamingDetails.actualEndTime
      ) {
        // TODO:
        liveStreams = liveStreams.filter(id => id != video.id);
        fields = {
          ...fields,
          [`streams/${id}/actualEndTime`]: video.liveStreamingDetails
            .actualEndTime
        };
      } else if (
        video.liveStreamingDetails &&
        video.liveStreamingDetails.concurrentViewers
      ) {
        if (video.liveStreamingDetails.actualStartTime) {
          fields = {
            ...fields,
            [`streams/${id}/actualStartTime`]: video.liveStreamingDetails
              .actualStartTime
          };
        }
        fields = {
          ...fields,
          [`stats/viewers/${id}/${now}`]: parseInt(
            video.liveStreamingDetails.concurrentViewers
          )
        };
      }
    }

    await rootRef.update(fields);

    res.send(`Updated ${liveStreams.length} Live Streams.`);
  } else {
    res.send("Nothing to update.");
  }
});
