import {
  ConferenceCreationRequest,
  ConferenceUpdateRequest,
} from "./conference";
import { ConferenceId } from "./conference-id";

export interface ConferenceWriteService {
  addConference: (model: ConferenceCreationRequest) => Promise<ConferenceId>;
  updateConference: (updateFields: ConferenceUpdateRequest) => Promise<void>;
  deleteConference: (conferenceId: ConferenceId) => Promise<void>;
}
