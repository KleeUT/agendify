import { ConferenceCreationRequest } from "./conference";

export interface ConferenceWriteService {
  addConference: (model: ConferenceCreationRequest) => Promise<string>;
  deleteConference: (conferenceId: string) => Promise<void>;
}
