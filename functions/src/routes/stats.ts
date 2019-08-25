import * as express from "express";

import { db } from "../api";
import { isAuthenticated } from "../middlewares";

const statsRef = db.ref("stats");

export const router = express.Router();

router.post("/update", isAuthenticated, async (req, res) => {
  if (req.body) {
    await statsRef.update(req.body);
  }
  res.sendStatus(200);
});
