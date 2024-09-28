import { Maybe } from "../../utils/maybe";
import { ConferenceId } from "../conference/conference-id";
import { SpeakerDetails } from "./speaker";
import { SpeakerId } from "./speaker-id";

export interface SpeakerReadService {
  getSpeaker(
    conferenceId: ConferenceId,
    speakerId: SpeakerId,
  ): Promise<Maybe<SpeakerDetails>>;
  getAllSpeakers(conferenceId: ConferenceId): Promise<Array<SpeakerDetails>>;
}
