import { initialise } from "../context";

import { Router } from "express";
import { config } from "../../config";
// import { findMissingProperties } from "../../utils/findMissingProperties";
import { handleError } from "../../utils/handleError";
import { findMissingProperties } from "../../utils/findMissingProperties";
import { ConferenceId } from "../conference/conference-id";

const agendaRouter = Router({});

agendaRouter.get(":conferenceId/agenda", async (req, res, next) => {
  handleError(next, async () => {
    const { agendaReadService } = initialise(config);

    const { conferenceId } = req.params;
    const agenda = await agendaReadService.getAgenda(
      ConferenceId.parse(conferenceId),
    );
    if (agenda.hasError()) {
      res.status(500);
    }
    res.json({ agenda });
  });
});

agendaRouter.put(":conferenceId/agenda/track", (req, res, next) => {
  handleError(next, async () => {
    const { agendaWriteService } = initialise(config);
    const body = req.body;
    const { conferenceId } = req.params;
    const missing = findMissingProperties(body, ["name", "location"]);

    if (missing.length > 0) {
      return res.status(400).json({
        errMsg: `Missing properties for ${missing.join(", ")}`,
      });
    }
    await agendaWriteService.addTrack(ConferenceId.parse(conferenceId), {
      name: body.name,
      location: body.location,
    });
  });
});

agendaRouter.put(":conferenceId/agenda/timeSlot", (req, res, next) => {
  handleError(next, async () => {
    const { agendaWriteService } = initialise(config);
    const body = req.body;
    const { conferenceId } = req.params;
    const missing = findMissingProperties(body, ["start", "stop"]);

    if (missing.length > 0) {
      return res.status(400).json({
        errMsg: `Missing properties for ${missing.join(", ")}`,
      });
    }

    await agendaWriteService.addTimeSlot(ConferenceId.parse(conferenceId), {
      start: new Date(body.start),
      stop: new Date(body.stop),
    });
  });
});

export { agendaRouter };
