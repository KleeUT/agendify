import { ConferenceId } from "../conference/conference-id";
import { SpeakerDetails } from "./speaker";
import { SpeakerId } from "./speaker-id";

export interface SpeakerStore {
  addSpeaker(
    conferenceId: ConferenceId,
    speaker: SpeakerDetails,
  ): Promise<void>;
  updateSpeaker(
    conferenceId: ConferenceId,
    speaker: Partial<SpeakerDetails> & Pick<SpeakerDetails, "speakerId">,
  ): Promise<void>;
  getSpeaker(
    conferenceId: ConferenceId,
    speakerId: SpeakerId,
  ): Promise<SpeakerDetails>;
  getAllSpeakers(conferenceId: ConferenceId): Promise<Array<SpeakerDetails>>;
  deleteSpeaker(
    conferenceId: ConferenceId,
    speakerId: SpeakerId,
  ): Promise<void>;
}
