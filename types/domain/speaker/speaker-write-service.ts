import { SpeakerDetails } from "./speaker";

export interface SpeakerWriteService {
  addSpeaker(
    conferenceId: string,
    speakerDetails: Omit<SpeakerDetails, "speakerId">,
  ): Promise<string>;
  updateSpeaker(
    conferenceId: string,
    speakerId: string,
    speakerDetails: Partial<SpeakerDetails>,
  ): Promise<string>;
  deleteSpeaker(params: {
    speakerId: string;
    conferenceId: string;
  }): Promise<void>;
}
