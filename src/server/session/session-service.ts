import { SessionDetails } from "../../../types/domain/session";
import {
  SessionReadService,
  SessionWriteService,
} from "../../../types/domain/session";
import { SessionStore } from "./session-store";
import { randomUUID } from "crypto";

export class SessionService implements SessionWriteService, SessionReadService {
  constructor(private readonly store: SessionStore) {}
  getSession({
    conferenceId,
    sessionId,
  }: {
    conferenceId: string;
    sessionId: string;
  }): Promise<SessionDetails> {
    return this.store.getSession({ sessionId, conferenceId }); //TODO probably should be better but good for testing
  }
  async saveSession(
    details: Omit<SessionDetails, "sessionId">,
  ): Promise<string> {
    const sessionId = randomUUID();
    await this.store.addSession({
      ...details,
      sessionId,
    });

    return sessionId;
  }
  async getAllSessions(params: {
    conferenceId: string;
  }): Promise<Array<SessionDetails>> {
    const sessionDetails: Array<SessionDetails> =
      await this.store.getAllSessions(params.conferenceId);
    return sessionDetails;
  }
  async deleteSession({
    conferenceId,
    sessionId,
  }: {
    conferenceId: string;
    sessionId: string;
  }): Promise<void> {
    await this.store.deleteSession({ sessionId, conferenceId });
  }
}
