import * as admin from "firebase-admin";
import { differenceInMinutes, parseISO, compareDesc } from "date-fns";

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

  async updateCache() {
    console.time("Update database cache");

    let now = new Date();

    let [updatedAt, vtubers, streams] = await Promise.all([
      db.ref("/updatedAt").once("value"),
      differenceInMinutes(now, this.vtubers.updatedAt) >= 30
        ? db.ref("/vtubers").once("value")
        : Promise.resolve(null),
      differenceInMinutes(now, this.streams.updatedAt) >= 5
        ? db.ref("/streams").once("value")
        : Promise.resolve(null)
    ]);

    let updatedAtVal = updatedAt.val();

    this.streams.updatedAt = parseISO(updatedAtVal.streamList);
    this.vtubers.updatedAt = parseISO(updatedAtVal.vtuberStat);

    if (streams != null) {
      this.streams.items = [];
      streams.forEach(snap => {
        if (snap.key != "_current") {
          this.streams.items.push(snap.val());
        }
      });
      this.streams.items.sort((a, b) =>
        compareDesc(parseISO(a.start), parseISO(b.start))
      );
      console.log("Streams Updated.");
    }

    if (vtubers != null) {
      this.vtubers.items = [];
      vtubers.forEach(snap => {
        this.vtubers.items.push(snap.val());
      });
      console.log("VTubers Updated.");
    }

    console.timeEnd("Update database cache");
  }

  findVTuber(id: string): VTuber {
    return this.vtubers.items.find(v => v.id == id) as VTuber;
  }

  findStream(id: string): Stream {
    return this.streams.items.find(s => s.id == id) as Stream;
  }

  async vtuberStats(id: string) {
    return (await db.ref(`/vtuberStats/${id}`).once("value")).val();
  }

  async streamStats(id: string) {
    return (await db.ref(`/streamStats/${id}`).once("value")).val();
  }
}
