import { SessionDetails } from "./session";

export interface SessionReadService {
  getSession(params: {
    conferenceId: string;
    sessionId: string;
  }): Promise<SessionDetails>;
}
