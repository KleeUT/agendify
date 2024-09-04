import { ConferenceDetails } from "./conference";
import { ConferenceId } from "./conference-id";

export interface ConferenceReadService {
  getConference(conferenceId: ConferenceId): Promise<ConferenceDetails>;
  getAllConferences(): Promise<Array<ConferenceDetails>>;
}
