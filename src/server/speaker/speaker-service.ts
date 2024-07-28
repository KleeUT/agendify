import {
  SpeakerWriteService,
  SpeakerReadService,
} from "../../../types/domain/speaker";
import { SpeakerDetails } from "../../../types/domain/speaker";
import { randomUUID } from "crypto";
import { SpeakerStore } from "./speaker-store";
export class SpeakerService implements SpeakerWriteService, SpeakerReadService {
  constructor(private readonly speakerStore: SpeakerStore) {}
  async addSpeaker(
    conferenceId: string,
    speakerDetails: SpeakerDetails,
  ): Promise<string> {
    const speakerId = randomUUID();
    await this.speakerStore.addSpeaker({
      name: speakerDetails.name,
      bio: speakerDetails.bio,
      picture: speakerDetails.picture,
      socials: speakerDetails.socials,
      id: speakerId,
      conferenceId,
    });
    return speakerId;
  }
  getSpeaker(props: {
    conferenceId: string;
    speakerId: string;
  }): Promise<SpeakerDetails> {
    return this.speakerStore.getSpeaker(props);
  }
  getAllSpeakers(conferenceId: string): Promise<Array<SpeakerDetails>> {
    return this.speakerStore.getAllSpeakers({ conferenceId });
  }
  async deleteSpeaker(params: {
    speakerId: string;
    conferenceId: string;
  }): Promise<void> {
    this.speakerStore.deleteSpeaker(params);
  }
  async updateSpeaker(
    conferenceId: string,
    speakerId: string,
    speakerDetails: Partial<SpeakerDetails>,
  ): Promise<string> {
    await this.speakerStore.updateSpeaker({
      conferenceId,
      id: speakerId,
      bio: speakerDetails.bio,
      name: speakerDetails.name,
      picture: speakerDetails.picture,
      socials: speakerDetails.socials,
    });
    return speakerId;
  }
}
