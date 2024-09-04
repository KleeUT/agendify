import { ConferenceId } from "../conference/conference-id";
import { SessionDetails } from "./session";
import { SessionId } from "./session-id";

export interface SessionWriteService {
  saveSession(details: Omit<SessionDetails, "sessionId">): Promise<SessionId>;
  deleteSession(
    conferenceId: ConferenceId,
    sessionId: SessionId,
  ): Promise<void>;
}
