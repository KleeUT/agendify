import { ConferenceDetails } from "./conference";

export interface ConferenceReadService {
  getConference(conferenceId: string): Promise<ConferenceDetails>;
}
