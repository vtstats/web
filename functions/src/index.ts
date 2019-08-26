import * as functions from "firebase-functions";
import * as express from "express";

import { router as streamsRouter } from "./routes/streams";
import { router as vtubersRouter } from "./routes/vtubers";

const app = express();

app.use(express.json());
app.use("/api/streams", streamsRouter);
app.use("/api/vtubers", vtubersRouter);

export const api = functions.https.onRequest(app);

export * from "./database";
