import { Router } from "express";
import { findMissingProperties } from "../../utils/findMissingProperties";
import { initialise } from "../context";
import { config } from "../../config";

const router = Router({});

router.post("/:conferenceId/session", async (req, res) => {
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

router.get("/:conferenceId/session/:sessionId", async (req, res) => {
  const { conferenceId, sessionId } = req.params;
  const context = initialise(config);
  const session = await context.sessionReadService.getSession({
    conferenceId,
    sessionId,
  });
  return res.json(session);
});
