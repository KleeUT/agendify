import { SpeakerModel } from "../../../types/domain/speaker";

export interface SpeakerStore {
  addSpeaker(model: SpeakerModel): Promise<void>;
  getSpeaker(props: {
    conferenceId: string;
    speakerId: string;
  }): Promise<SpeakerModel>;
}
