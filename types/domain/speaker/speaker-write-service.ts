import { SpeakerDetails } from "./speaker";

export interface SpeakerWriteService {
  addSpeaker(
    conferenceId: string,
    speakerDetails: SpeakerDetails,
  ): Promise<string>;
}
