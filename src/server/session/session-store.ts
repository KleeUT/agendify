import { ConferenceId } from "../conference/conference-id";
import { SessionDetails } from "./session";
import { SessionId } from "./session-id";

export interface SessionStore {
  addSession(session: SessionDetails): Promise<void>;
  getSession(
    conferenceId: ConferenceId,
    sessionId: SessionId,
  ): Promise<SessionDetails>;
  getAllSessions(conferenceId: ConferenceId): Promise<Array<SessionDetails>>;
  deleteSession(
    conferenceId: ConferenceId,
    sessionId: SessionId,
  ): Promise<void>;
}
