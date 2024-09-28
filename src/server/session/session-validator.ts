import { ConferenceId } from "../conference/conference-id";
import { SessionId } from "./session-id";
import { SessionStore } from "./session-store";

export class SessionValidator {
  constructor(private readonly store: SessionStore) {}
  async sessionExists(
    conferenceId: ConferenceId,
    sessionId: SessionId,
  ): Promise<boolean> {
    const session = await this.store.getSession(conferenceId, sessionId);
    return session.hasValue();
  }
}
