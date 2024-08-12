import {
  ConferenceCreationRequest,
  ConferenceUpdateRequest,
} from "./conference";

export interface ConferenceWriteService {
  addConference: (model: ConferenceCreationRequest) => Promise<string>;
  updateConference: (updateFields: ConferenceUpdateRequest) => Promise<void>;
  deleteConference: (conferenceId: string) => Promise<void>;
}
