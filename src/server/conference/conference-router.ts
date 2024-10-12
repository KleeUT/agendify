import { initialise } from "../context";

import { Router } from "express";
import { config } from "../../config";
import { findMissingProperties } from "../../utils/findMissingProperties";
import { handleError } from "../../utils/handleError";
import { ConferenceId } from "./conference-id";
import { ConferenceLocation } from "./conference";

type ConferenceViewModel = {
  name: string;
  conferenceId: string;
  location: ConferenceLocation;
};

const conferenceRouter = Router({});

conferenceRouter.get("/conference", async (req, res, next) => {
  await handleError(next, async () => {
    const context = initialise(config);
    const allConferences =
      await context.conferenceReadService.getAllConferences();
    res.json({
      allConferences: allConferences.map((conference) => ({
        conferenceId: conference.conferenceId.toString(),
        location: conference.location,
        name: conference.name,
      })),
    });
  });
});

conferenceRouter.get("/conference/:conferenceId", async (req, res, next) => {
  await handleError(next, async () => {
    const context = initialise(config);
    const conference = await context.conferenceReadService.getConference(
      ConferenceId.parse(req.params.conferenceId),
    );
    const vm: ConferenceViewModel = {
      conferenceId: conference.value.conferenceId.toString(),
      location: conference.value.location,
      name: conference.value.name,
    };
    res.json({ conference: vm });
  });
});

conferenceRouter.delete("/conference/:conferenceId", async (req, res, next) => {
  await handleError(next, async () => {
    const context = initialise(config);
    await context.conferenceWriteService.deleteConference(
      ConferenceId.parse(req.params.conferenceId),
    );
    res.json({});
  });
});

conferenceRouter.post("/conference", async (req, res, next) => {
  handleError(next, async () => {
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
});

conferenceRouter.patch("/conference/:conferenceId", async (req, res, next) => {
  handleError(next, async () => {
    const conferenceId = ConferenceId.parse(req.params.conferenceId);
    const body = req.body;
    const context = initialise(config);

    const updatedIdConferenceId =
      await context.conferenceWriteService.updateConference({
        conferenceId,
        name: body.name,
        location: {
          building: body.building,
          street: body.street,
          suburb: body.suburb,
        },
      });
    return res.json({ conferenceId: updatedIdConferenceId });
  });
});

export { conferenceRouter };
