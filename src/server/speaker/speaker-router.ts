import { Router } from "express";
import { findMissingProperties } from "../../utils/findMissingProperties";
import { initialise } from "../context";
import { config } from "../../config";

const speakerRouter = Router({});

speakerRouter.post("/:conferenceId/speaker", async (req, res) => {
  const conferenceId = req.params.conferenceId;
  const context = initialise(config);
  const missing = findMissingProperties(req.body, ["name", "bio", "picture"]);
  if (missing.length > 0) {
    return res.status(400).json({
      errMsg: `Missing properties for ${missing.join(", ")}`,
    });
  }
  if (req.body.socials && !Array.isArray(req.body.socials)) {
    return res.status(400).json({
      errMsg: `Missing properties for ${missing.join(", ")}`,
    });
  }
  const { name, bio, picture, socials } = req.body;
  const speakerId = await context.speakerWriteService.addSpeaker(conferenceId, {
    name,
    bio,
    picture,
    socials,
  });
  return res.json({ speakerId, conferenceId });
});

speakerRouter.get("/:conferenceId/speaker/:speakerId", async (req, res) => {
  const { conferenceId, speakerId } = req.params;
  const context = initialise(config);
  const speaker = await context.speakerReadService.getSpeaker({
    conferenceId,
    speakerId,
  });
  return res.json(speaker);
});

export { speakerRouter };
