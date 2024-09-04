import { ConferenceId } from "../conference/conference-id";
import { SpeakerId } from "../speaker/speaker-id";
import { SessionId } from "./session-id";

export interface SessionDetails {
  conferenceId: ConferenceId;
  sessionId: SessionId;
  speakerIds: Array<SpeakerId>;
  title: string;
  abstract: string;
  tags: Array<string>;
}
