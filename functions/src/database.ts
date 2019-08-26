import * as functions from "firebase-functions";

import { db } from "./admin";

const streamsRef = db.ref("/streams");

export const updateStreamStatus = functions.database
  .ref("/stats/viewers/{id}")
  .onUpdate((snap, ctx) => {
    const viewers: number[] = Object.values(snap.after.val());
    return streamsRef.update({
      [`${ctx.params.id}/maxViewers`]: Math.max(...viewers),
      [`${ctx.params.id}/avgViewers`]: Math.floor(
        viewers.reduce((a, b) => a + b, 0) / viewers.length
      )
    });
  });
