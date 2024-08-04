import express, { NextFunction, Response, Request } from "express";

import serverless from "serverless-http";
import { conferenceRouter } from "./src/server/conference/conference-router";
import { speakerRouter } from "./src/server/speaker/speaker-router";
import { sessionRouter } from "./src/server/session/session-router";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log({ msg: "request received", path: req.path, method: req.method });
  next();
});

app.use(conferenceRouter);
app.use(speakerRouter);
app.use(sessionRouter);

app.get("/hello", (_req, res) => res.json({ hello: "world" }));

app.use((req, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("app use error handler", err.stack);
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({
    err: {
      msg: `Something went wrong on ${req.path}`,
      stack: err.stack,
      errMsg: err.message,
    },
  });
});

module.exports.handler = serverless(app);

process.on("unhandledRejection", (reason: string, p: Promise<unknown>) => {
  console.error("Unhandled Rejection at:", p, "reason:", reason);
});
