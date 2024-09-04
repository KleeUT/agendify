import { ConferenceDetails, ConferenceLocation } from "./conference";
import { ConferenceId } from "./conference-id";

export interface ConferenceStore {
  storeConference(details: ConferenceDetails): Promise<void>;
  getConference(conferenceId: ConferenceId): Promise<ConferenceDetails>;
  getAllConferences(): Promise<Array<ConferenceDetails>>;
  deleteConference(conferenceId: ConferenceId): Promise<void>;
  updateConference(details: {
    conferenceId: ConferenceId;
    location: Partial<ConferenceLocation>;
    name?: string;
  }): Promise<void>;
}
