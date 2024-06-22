import { SpeakerDetails } from "./speaker";

export interface SpeakerReadService {
  getSpeaker(props: {
    conferenceId: string;
    speakerId: string;
  }): Promise<SpeakerDetails>;
  getAllSpeakers(conferenceId: string): Promise<Array<SpeakerDetails>>;
}
