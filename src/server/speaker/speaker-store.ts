import { SpeakerDetails } from "../../../types/domain/speaker";

export interface SpeakerStore {
  addSpeaker(conferenceId: string, speaker: SpeakerDetails): Promise<void>;
  updateSpeaker(
    conferenceId: string,
    speaker: Partial<SpeakerDetails> & Pick<SpeakerDetails, "speakerId">,
  ): Promise<void>;
  getSpeaker(props: {
    conferenceId: string;
    speakerId: string;
  }): Promise<SpeakerDetails>;
  getAllSpeakers(props: {
    conferenceId: string;
  }): Promise<Array<SpeakerDetails>>;
  deleteSpeaker(params: {
    conferenceId: string;
    speakerId: string;
  }): Promise<void>;
}
