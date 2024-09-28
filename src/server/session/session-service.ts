import { ConferenceId } from "../conference/conference-id";
import { SessionId } from "./session-id";
import { SessionStore } from "./session-store";
import { randomUUID } from "crypto";
import { SessionWriteService } from "./session-write-service";
import { SessionReadService } from "./session-read-service";
import { SessionDetails } from "./session";
import { Maybe } from "../../utils/maybe";

export class SessionService implements SessionWriteService, SessionReadService {
  constructor(private readonly store: SessionStore) {}
  getSession(
    conferenceId: ConferenceId,
    sessionId: SessionId,
  ): Promise<Maybe<SessionDetails>> {
    return this.store.getSession(conferenceId, sessionId);
  }
  async saveSession(
    details: Omit<SessionDetails, "sessionId">,
  ): Promise<SessionId> {
    const sessionId = SessionId.parse(randomUUID());
    await this.store.addSession({
      ...details,
      sessionId,
    });

    return sessionId;
  }
  async getAllSessions(
    conferenceId: ConferenceId,
  ): Promise<Array<SessionDetails>> {
    const sessionDetails: Array<SessionDetails> =
      await this.store.getAllSessions(conferenceId);
    return sessionDetails;
  }
  async deleteSession(
    conferenceId: ConferenceId,
    sessionId: SessionId,
  ): Promise<void> {
    await this.store.deleteSession(conferenceId, sessionId);
  }
}
