import { ConferenceDetails } from "./conference";

export interface ConferenceReadService {
  getConference(conferenceId: string): Promise<ConferenceDetails>;
  getAllConferences(): Promise<Array<ConferenceDetails>>;
}
