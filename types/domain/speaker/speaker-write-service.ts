import { SpeakerDetails } from "./speaker";

export interface SpeakerWriteService {
  addSpeaker(
    conferenceId: string,
    speakerDetails: SpeakerDetails,
  ): Promise<string>;
  deleteSpeaker(params: {
    speakerId: string;
    conferenceId: string;
  }): Promise<void>;
}
