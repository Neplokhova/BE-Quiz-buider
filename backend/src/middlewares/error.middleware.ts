import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../lib/errors";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  void next;
  if (error instanceof HttpError) {
    res.status(error.status).json({
      code: error.code,
      message: error.message,
      details: error.details,
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      code: "BAD_REQUEST",
      message: "Malformed request payload",
      details: error.flatten(),
    });
    return;
  }

  res.status(500).json({
    code: "INTERNAL_ERROR",
    message: "An unexpected error occurred",
  });
};
