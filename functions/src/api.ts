import * as admin from "firebase-admin";
import { google } from "googleapis";
import * as functions from "firebase-functions";

const config = functions.config();

admin.initializeApp();

export const youtube = google.youtube({
  version: "v3",
  auth: config.key.youtube1
});

export const db = admin.database();
