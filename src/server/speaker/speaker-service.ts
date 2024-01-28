import { SpeakerWriteService } from "../../../types/domain/speaker-write-service";
import { SpeakerDetails } from "../../../types/speaker";
import { randomUUID } from "crypto";
import { SpeakerStore } from "./speaker-store";
import { SpeakerReadService } from "../../../types/domain/speaker-read-service";
export class SpeakerService implements SpeakerWriteService, SpeakerReadService {
  constructor(private readonly speakerStore: SpeakerStore) {}
  async addSpeaker(
    conferenceId: string,
    speakerDetails: SpeakerDetails
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
}
