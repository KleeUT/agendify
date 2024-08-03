import { NextFunction, type Response } from "express";

export async function handleError(
  res: Response,
  next: NextFunction,
  thingThatMightThrow: () => Promise<unknown>,
) {
  try {
    await thingThatMightThrow();
  } catch (e: unknown) {
    next(e);
  }
}
