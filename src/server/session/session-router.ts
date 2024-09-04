import { Router } from "express";
import { findMissingProperties } from "../../utils/findMissingProperties";
import { initialise } from "../context";
import { config } from "../../config";
import { handleError } from "../../utils/handleError";
import { ConferenceId } from "../conference/conference-id";
import { SessionId } from "./session-id";

const sessionRouter = Router({});

sessionRouter.post("/:conferenceId/session", async (req, res, next) => {
  handleError(next, async () => {
    const conferenceId = req.params.conferenceId;
    const context = initialise(config);
    const missing = findMissingProperties(req.body, [
      "speakerIds",
      "title",
      "abstract",
      "tags",
    ]);
    if (missing.length > 0) {
      return res.status(400).json({
        errMsg: `Missing properties for ${missing.join(", ")}`,
      });
    }
    const { speakerIds, title, abstract, tags } = req.body;
    const sessionId = await context.sessionWriteService.saveSession({
      conferenceId: ConferenceId.parse(conferenceId),
      speakerIds,
      title,
      abstract,
      tags,
    });
    return res.json({
      sessionId,
    });
  });
});

sessionRouter.get(
  "/:conferenceId/session/:sessionId",
  async (req, res, next) => {
    handleError(next, async () => {
      const { conferenceId, sessionId } = req.params;
      const context = initialise(config);
      const session = await context.sessionReadService.getSession(
        ConferenceId.parse(conferenceId),
        SessionId.parse(sessionId),
      );
      return res.json(session);
    });
  },
);
sessionRouter.delete(
  "/:conferenceId/session/:sessionId",
  async (req, res, next) => {
    handleError(next, async () => {
      const { conferenceId, sessionId } = req.params;
      const context = initialise(config);
      await context.sessionWriteService.deleteSession(
        ConferenceId.parse(conferenceId),
        SessionId.parse(sessionId),
      );
      res.json({ deleted: true });
    });
  },
);

sessionRouter.get("/:conferenceId/session", async (req, res, next) => {
  handleError(next, async () => {
    const { conferenceId } = req.params;
    const context = initialise(config);
    const session = await context.sessionReadService.getAllSessions(
      ConferenceId.parse(conferenceId),
    );
    return res.json(session);
  });
});

export { sessionRouter };
