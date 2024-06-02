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
  async saveSession(details: SessionDetails): Promise<string> {
    const sessionId = randomUUID();
    await this.store.addSession({
      ...details,
    });

    return sessionId;
  }
}
