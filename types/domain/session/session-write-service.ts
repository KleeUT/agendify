import { SessionDetails } from "./session";

export interface SessionWriteService {
  saveSession(details: Omit<SessionDetails, "sessionId">): Promise<string>;
}
