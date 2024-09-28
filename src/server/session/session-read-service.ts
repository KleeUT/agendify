import { Maybe } from "../../utils/maybe";
import { ConferenceId } from "../conference/conference-id";
import { SessionDetails } from "./session";
import { SessionId } from "./session-id";

export interface SessionReadService {
  getSession(
    conferenceId: ConferenceId,
    sessionId: SessionId,
  ): Promise<Maybe<SessionDetails>>;
  getAllSessions(conferenceId: ConferenceId): Promise<Array<SessionDetails>>;
}
