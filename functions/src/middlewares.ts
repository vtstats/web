import * as functions from "firebase-functions";
import { Request, Response, NextFunction } from "express";

const config = functions.config();

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    req.headers.authorization &&
    req.headers.authorization == config.key.server
  ) {
    return next();
  } else {
    return res.sendStatus(403);
  }
}
