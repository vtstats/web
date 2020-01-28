import { NextFunction, Request, Response } from "express";
import {
  param,
  query,
  ValidationChain,
  validationResult
} from "express-validator";
import vtubers from "../../vtubers.json";

const vtuber_ids: string[] = [];

for (const item of vtubers.items) {
  for (const member of item.members) {
    vtuber_ids.push(member.id);
  }
}

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    } else {
      res.status(422).json({ errors: errors.array() });
    }
  };
};

export const validateIdParam = param("id")
  .isString()
  .isIn(vtuber_ids);

export const validateIdsQuery = query("ids")
  .isString()
  .customSanitizer((val: string) => val.split(","))
  .custom((ids: string[]) => ids.every(id => vtuber_ids.includes(id)));

export const validateStartAtQuery = query("startAt")
  .isISO8601()
  .toDate();

export const validateEndAtQuery = query("endAt")
  .isISO8601()
  .toDate();

export const validateShallow = query("shallow")
  .optional()
  .isBoolean()
  .toBoolean();
