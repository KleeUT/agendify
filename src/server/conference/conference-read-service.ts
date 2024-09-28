import { Maybe } from "../../utils/maybe";
import { ConferenceDetails } from "./conference";
import { ConferenceId } from "./conference-id";

export interface ConferenceReadService {
  getConference(conferenceId: ConferenceId): Promise<Maybe<ConferenceDetails>>;
  getAllConferences(): Promise<Array<ConferenceDetails>>;
}
