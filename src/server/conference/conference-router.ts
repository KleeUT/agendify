import { initialise } from "../context";

import { Router } from "express";
import { config } from "../../config";
import { findMissingProperties } from "../../utils/findMissingProperties";
import { handleError } from "../../utils/handleError";

const conferenceRouter = Router({});

conferenceRouter.get("/conference", async (req, res, next) => {
  await handleError(next, async () => {
    const context = initialise(config);
    const allConferences =
      await context.conferenceReadService.getAllConferences();
    res.json({ allConferences });
  });
});

conferenceRouter.get("/conference/:conferenceId", async (req, res, next) => {
  await handleError(next, async () => {
    const context = initialise(config);
    const conference = await context.conferenceReadService.getConference(
      req.params.conferenceId,
    );
    res.json({ conference });
  });
});

conferenceRouter.delete("/conference/:conferenceId", async (req, res, next) => {
  await handleError(next, async () => {
    const context = initialise(config);
    const conference = await context.conferenceWriteService.deleteConference(
      req.params.conferenceId,
    );
    res.json({ conference });
  });
});

conferenceRouter.post("/conference", async (req, res) => {
  const body = req.body;
  const context = initialise(config);
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
