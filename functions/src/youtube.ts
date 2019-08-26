import axios from "axios";
import * as functions from "firebase-functions";

const config = functions.config();

const keys = [
  config.key.youtube1,
  config.key.youtube2,
  config.key.youtube3,
  config.key.youtube4
];
let keyIndex = 0;

function nextKey() {
  if (keyIndex == keys.length - 1) {
    keyIndex = 0;
  } else {
    keyIndex += 1;
  }
}

export async function listChannels(id: string[]): Promise<Channel[]> {
  for (let i = 0; i < keys.length; i++) {
    try {
      return await _listChannels(id, keys[keyIndex]);
    } catch (e) {
      console.info(
        "Failed to call YouTube API.",
        JSON.stringify(e.response.data)
      );
      console.info("Switching to next key.");
      nextKey();
    }
  }
  throw Error("Failed to call YouTube API.");
}

export async function listVideos(id: string[]): Promise<Video[]> {
  for (let i = 0; i < keys.length; i++) {
    try {
      return await _listVideos(id, keys[keyIndex]);
    } catch (e) {
      console.info(
        "Failed to call YouTube API.",
        JSON.stringify(e.response.data)
      );
      console.info("Switching to next key.");
      nextKey();
    }
  }
  throw Error("Failed to call YouTube API.");
}

async function _listChannels(id: string[], key: string): Promise<Channel[]> {
  const res = await axios.get(
    "https://www.googleapis.com/youtube/v3/channels",
    {
      params: {
        part: "statistics",
        id: id.join(","),
        key
      }
    }
  );
  return res.data.items;
}

async function _listVideos(id: string[], key: string): Promise<Video[]> {
  const res = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
    params: {
      part: "liveStreamingDetails,id",
      id: id.join(","),
      key
    }
  });
  return res.data.items;
}

type Video = {
  id: string;
  liveStreamingDetails?: {
    actualStartTime?: string;
    actualEndTime?: string;
    scheduledStartTime?: string;
    concurrentViewers?: string;
  };
};

type Channel = {
  id: string;
  statistics: {
    viewCount: string;
    subscriberCount: string;
  };
};
