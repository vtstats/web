import * as cors from "cors";
import * as express from "express";
import * as functions from "firebase-functions";

import { router as streamsRouter } from "./routes/streams";
import { router as vtubersRouter } from "./routes/vtubers";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: "GET"
  })
);

app.use("/api/streams", streamsRouter);
app.use("/api/vtubers", vtubersRouter);

export const api = functions.https.onRequest(app);
