import { Router } from "express";
import { findMissingProperties } from "../../utils/findMissingProperties";
import { initialise } from "../context";
import { config } from "../../config";
import { handleError } from "../../utils/handleError";
import { SpeakerDetails } from "../../../types/domain/speaker";

const speakerRouter = Router({});

speakerRouter.post("/:conferenceId/speaker", async (req, res, next) => {
  handleError(next, async () => {
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
    const speakerId = await context.speakerWriteService.addSpeaker(
      conferenceId,
      {
        name,
        bio,
        picture,
        socials,
      },
    );
    return res.json({ speakerId, conferenceId });
  });
});

speakerRouter.patch(
  "/:conferenceId/speaker/:speakerId",
  async (req, res, next) => {
    handleError(next, async () => {
      const { conferenceId, speakerId } = req.params;
      const context = initialise(config);
      const { name, bio, picture, socials } =
        req.body as Partial<SpeakerDetails>;
      const speaker = await context.speakerWriteService.updateSpeaker(
        conferenceId,
        speakerId,
        {
          name,
          bio,
          picture,
          socials,
        },
      );
      return res.json(speaker);
    });
  },
);

speakerRouter.get(
  "/:conferenceId/speaker/:speakerId",
  async (req, res, next) => {
    handleError(next, async () => {
      const { conferenceId, speakerId } = req.params;
      const context = initialise(config);
      const speaker = await context.speakerReadService.getSpeaker({
        conferenceId,
        speakerId,
      });
      return res.json(speaker);
    });
  },
);

speakerRouter.delete(
  "/:conferenceId/speaker/:speakerId",
  async (req, res, next) => {
    handleError(next, async () => {
      const { conferenceId, speakerId } = req.params;
      const context = initialise(config);
      const speaker = await context.speakerWriteService.deleteSpeaker({
        conferenceId,
        speakerId,
      });
      return res.json(speaker);
    });
  },
);

speakerRouter.get("/:conferenceId/speaker/", async (req, res, next) => {
  handleError(next, async () => {
    const { conferenceId } = req.params;
    const context = initialise(config);
    const speakers =
      await context.speakerReadService.getAllSpeakers(conferenceId);
    return res.json({ speakers: speakers });
  });
});

export { speakerRouter };
