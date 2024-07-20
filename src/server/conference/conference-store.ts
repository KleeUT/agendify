import { ConferenceDetails } from "../../../types/domain/conference";

export interface ConferenceStore {
  storeConference(model: ConferenceDetails): Promise<void>;
  getConference(conferenceId: string): Promise<ConferenceDetails>;
  getAllConferences(): Promise<Array<ConferenceDetails>>;
  deleteConference(conferenceId: string): Promise<void>;
}
