import { ConferenceId } from "../conference/conference-id";
import { SpeakerDetails } from "./speaker";
import { SpeakerId } from "./speaker-id";

export interface SpeakerWriteService {
  addSpeaker(
    conferenceId: ConferenceId,
    speakerDetails: Omit<SpeakerDetails, "speakerId">,
  ): Promise<SpeakerId>;
  updateSpeaker(
    conferenceId: ConferenceId,
    speakerId: SpeakerId,
    speakerDetails: Partial<SpeakerDetails>,
  ): Promise<SpeakerId>;
  deleteSpeaker(
    conferenceId: ConferenceId,
    speakerId: SpeakerId,
  ): Promise<void>;
}
