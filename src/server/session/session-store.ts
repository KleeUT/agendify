import { SessionDetails, SessionModel } from "../../../types/domain/session";

export interface SessionStore {
  addSession(session: SessionModel): Promise<void>;
  getSession(identifiers: {
    conferenceId: string;
    sessionId: string;
  }): Promise<SessionDetails>;
}
