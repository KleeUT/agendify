import { Router } from "express";
import { findMissingProperties } from "../../utils/findMissingProperties";
import { initialise } from "../context";
import { config } from "../../config";
import { handleError } from "../../utils/handleError";
import { ConferenceId } from "../conference/conference-id";
import { SessionId } from "./session-id";
import { NoItem } from "../../utils/dynamo/no-item";

const sessionRouter = Router({});

sessionRouter.post("/:conferenceId/session", async (req, res, next) => {
  handleError(next, async () => {
    const conferenceId = ConferenceId.parse(req.params.conferenceId);
    const context = initialise(config);
    if (!(await context.conferenceValidator.conferenceExists(conferenceId))) {
      return res.status(404);
    }

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
      conferenceId,
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
      const sessionMaybe = await context.sessionReadService.getSession(
        ConferenceId.parse(conferenceId),
        SessionId.parse(sessionId),
      );
      if (sessionMaybe.hasValue()) {
        return res.json(sessionMaybe.value);
      }
      if (sessionMaybe.error instanceof NoItem) {
        const error = sessionMaybe.error as NoItem;
        return res.status(404).json(error.metaData);
      }
      throw sessionMaybe.error;
    });
  },
);
sessionRouter.delete(
  "/:conferenceId/session/:sessionId",
  async (req, res, next) => {
    handleError(next, async () => {
      const { conferenceId: rawConferenceId, sessionId: rawSessionId } =
        req.params;
      const context = initialise(config);
      const conferenceId = ConferenceId.parse(rawConferenceId);
      const sessionId = SessionId.parse(rawSessionId);
      if (
        !(await context.sessionValidator.sessionExists(conferenceId, sessionId))
      ) {
        return res.status(404);
      }
      await context.sessionWriteService.deleteSession(conferenceId, sessionId);
      res.json({ deleted: true });
    });
  },
);

sessionRouter.get("/:conferenceId/session", async (req, res, next) => {
  handleError(next, async () => {
    const { conferenceId: rawId } = req.params;
    const conferenceId = ConferenceId.parse(rawId);
    const context = initialise(config);
    if (!(await context.conferenceValidator.conferenceExists(conferenceId))) {
      return res.status(404);
    }
    const session =
      await context.sessionReadService.getAllSessions(conferenceId);
    return res.json(session);
  });
});

export { sessionRouter };
