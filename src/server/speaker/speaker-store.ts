import { SpeakerModel } from "../../../types/domain/speaker";

export interface SpeakerStore {
  addSpeaker(model: SpeakerModel): Promise<void>;
  updateSpeaker(
    model: Partial<SpeakerModel> &
      Pick<SpeakerModel, "id"> &
      Pick<SpeakerModel, "conferenceId">,
  ): Promise<void>;
  getSpeaker(props: {
    conferenceId: string;
    speakerId: string;
  }): Promise<SpeakerModel>;
  getAllSpeakers(props: { conferenceId: string }): Promise<Array<SpeakerModel>>;
  deleteSpeaker(params: {
    conferenceId: string;
    speakerId: string;
  }): Promise<void>;
}
