import { Maybe } from "../../utils/maybe";
import { ConferenceId } from "../conference/conference-id";
import { Agenda } from "./types";

export interface AgendaStore {
  getAgenda(conferenceId: ConferenceId): Promise<Maybe<Agenda>>;
  storeAgenda(conferenceId: ConferenceId, agenda: Agenda): Promise<void>;
}
