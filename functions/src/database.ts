import * as admin from "firebase-admin";
import {
  differenceInMinutes,
  parseISO,
  compareDesc,
  getUnixTime,
  startOfToday
} from "date-fns";

import { Stream, VTuber } from "./models";

admin.initializeApp();

const db = admin.database();

interface Cache<T> {
  updatedAt: Date;
  items: T[];
}

export class Database {
  vtubers: Cache<VTuber> = { updatedAt: new Date(0), items: [] };
  streams: Cache<Stream> = { updatedAt: new Date(0), items: [] };

  async updateVTubersCache() {
    if (differenceInMinutes(new Date(), this.vtubers.updatedAt) < 60) {
      return;
    }

    const [updatedAt, vtubers] = await Promise.all([
      db.ref("/updatedAt").once("value"),
      db.ref("/vtubers").once("value")
    ]);

    if (vtubers.numChildren() > 0) {
      this.vtubers.updatedAt = parseISO(updatedAt.val().vtuberStat);

      this.vtubers.items = [];

      vtubers.forEach(snap => {
        this.vtubers.items.push(snap.val());
      });

      console.log("VTubers cache updated.");
    } else {
      console.error("Fail to fetch VTubers data.");
    }
  }

  async updateStreamsCache() {
    if (differenceInMinutes(new Date(), this.streams.updatedAt) < 5) {
      return;
    }

    const [updatedAt, streams] = await Promise.all([
      db.ref("/updatedAt").once("value"),
      db.ref("/streams").once("value")
    ]);

    if (streams.numChildren() > 0) {
      this.streams.updatedAt = parseISO(updatedAt.val().streamList);

      this.streams.items = [];

      streams.forEach(snap => {
        if (snap.key != "_current") {
          this.streams.items.push(snap.val());
        }
      });

      this.streams.items.sort((a, b) =>
        compareDesc(parseISO(a.start), parseISO(b.start))
      );

      console.log("Streams cache updated.");
    } else {
      console.log("Fail to fetch Streams data.");
    }
  }

  findVTuber(id: string): VTuber {
    return this.vtubers.items.find(v => v.id == id) as VTuber;
  }

  findStream(id: string): Stream {
    return this.streams.items.find(s => s.id == id) as Stream;
  }

  async vtuberStats(id: string) {
    const today = getUnixTime(startOfToday());
    const sevenDaysAgo = today - 6 * 24 * 60 * 60;
    return (await db
      .ref(`/vtuberStats/${id}`)
      .orderByKey()
      .startAt(sevenDaysAgo.toString())
      .once("value")).val();
  }

  async streamStats(id: string) {
    return (await db.ref(`/streamStats/${id}`).once("value")).val();
  }
}
