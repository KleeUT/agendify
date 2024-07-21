import { SessionDetails } from "./session";

export interface SessionWriteService {
  saveSession(details: Omit<SessionDetails, "sessionId">): Promise<string>;
  deleteSession({
    conferenceId,
    sessionId,
  }: {
    conferenceId: string;
    sessionId: string;
  }): Promise<void>;
}
