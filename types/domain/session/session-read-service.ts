import { SessionDetails } from "./session";

export interface SessionReadService {
  getSession(params: {
    conferenceId: string;
    sessionId: string;
  }): Promise<SessionDetails>;
  getAllSessions(params: {
    conferenceId: string;
  }): Promise<Array<SessionDetails>>;
}
