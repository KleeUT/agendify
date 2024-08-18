import {
  ConferenceDetails,
  ConferenceLocation,
} from "../../../types/domain/conference";

export interface ConferenceStore {
  storeConference(details: ConferenceDetails): Promise<void>;
  getConference(conferenceId: string): Promise<ConferenceDetails>;
  getAllConferences(): Promise<Array<ConferenceDetails>>;
  deleteConference(conferenceId: string): Promise<void>;
  updateConference(details: {
    id: string;
    location: Partial<ConferenceLocation>;
    name?: string;
  }): Promise<void>;
}
