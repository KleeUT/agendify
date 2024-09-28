import { ConferenceId } from "../conference/conference-id";
import { SpeakerId } from "./speaker-id";
import { SpeakerStore } from "./speaker-store";

export class SpeakerValidator {
  constructor(private readonly store: SpeakerStore) {}
  async speakerExists(
    conferenceId: ConferenceId,
    speakerId: SpeakerId,
  ): Promise<boolean> {
    const speaker = await this.store.getSpeaker(conferenceId, speakerId);
    return speaker.hasValue();
  }
}
