import type { NextFunction } from "express";

export async function handleError(
  next: NextFunction,
  thingThatMightThrow: () => Promise<unknown>,
) {
  try {
    await thingThatMightThrow();
  } catch (e: unknown) {
    next(e);
  }
}
