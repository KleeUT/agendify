import { Maybe } from "../../utils/maybe";
import { ConferenceId } from "../conference/conference-id";
import { Agenda } from "./types";

export interface AgendaReadService {
  getAgenda(conferenceId: ConferenceId): Promise<Maybe<Agenda>>;
}
