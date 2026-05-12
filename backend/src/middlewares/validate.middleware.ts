import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { HttpError } from "../lib/errors";

type ValidationTarget = "body" | "params" | "query";

export const validate =
  <T>(schema: ZodSchema<T>, target: ValidationTarget = "body") =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req[target]);

    if (!parsed.success) {
      next(
        new HttpError(422, "VALIDATION_ERROR", "Request validation failed", parsed.error.flatten()),
      );
      return;
    }

    req[target] = parsed.data as Request[ValidationTarget];
    next();
  };
