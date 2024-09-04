import { randomUUID } from "crypto";
import { SpeakerStore } from "./speaker-store";
import { SpeakerWriteService } from "./speaker-write-service";
import { SpeakerReadService } from "./speaker-read-service";
import { SpeakerDetails } from "./speaker";
import { ConferenceId } from "../conference/conference-id";
import { SpeakerId } from "./speaker-id";
export class SpeakerService implements SpeakerWriteService, SpeakerReadService {
  constructor(private readonly speakerStore: SpeakerStore) {}
  async addSpeaker(
    conferenceId: ConferenceId,
    speakerDetails: Omit<SpeakerDetails, "speakerId">,
  ): Promise<SpeakerId> {
    const speakerId = SpeakerId.parse(randomUUID());
    await this.speakerStore.addSpeaker(conferenceId, {
      speakerId,
      name: speakerDetails.name,
      bio: speakerDetails.bio,
      picture: speakerDetails.picture,
      socials: speakerDetails.socials,
    });
    return speakerId;
  }
  getSpeaker(
    conferenceId: ConferenceId,
    speakerId: SpeakerId,
  ): Promise<SpeakerDetails> {
    return this.speakerStore.getSpeaker(conferenceId, speakerId);
  }
  getAllSpeakers(conferenceId: ConferenceId): Promise<Array<SpeakerDetails>> {
    return this.speakerStore.getAllSpeakers(conferenceId);
  }
  async deleteSpeaker(
    conferenceId: ConferenceId,
    speakerId: SpeakerId,
  ): Promise<void> {
    this.speakerStore.deleteSpeaker(conferenceId, speakerId);
  }
  async updateSpeaker(
    conferenceId: ConferenceId,
    speakerId: SpeakerId,
    speakerDetails: Partial<SpeakerDetails>,
  ): Promise<SpeakerId> {
    await this.speakerStore.updateSpeaker(conferenceId, {
      speakerId,
      bio: speakerDetails.bio,
      name: speakerDetails.name,
      picture: speakerDetails.picture,
      socials: speakerDetails.socials,
    });
    return speakerId;
  }
}
