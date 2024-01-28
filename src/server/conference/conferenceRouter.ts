import { initalise } from "../context";

import { Router } from "express";
import { config } from "../../config";
import { findMissingProperties } from "../../utils/findMissingProperties";

const conferenceRouter = Router({});

conferenceRouter.get("/conference/:conferenceId", async (req, res) => {
  const context = initalise(config);
  const conf = await context.conferenceReadService.getConference(
    req.params.conferenceId
  );
  res.json(conf);
});

conferenceRouter.post("/conference", async (req, res) => {
  const body = req.body;
  const context = initalise(config);
  const missing = findMissingProperties(body, [
    "name",
    "building",
    "street",
    "suburb",
  ]);

  if (missing.length > 0) {
    return res.status(400).json({
      errMsg: `Missing properties for ${missing.join(", ")}`,
    });
  }

  const conferenceId = await context.conferenceWriteService.addConference({
    name: body.name,
    location: {
      building: body.building,
      street: body.street,
      suburb: body.suburb,
    },
  });
  return res.json({ conferenceId });
});

export { conferenceRouter };
