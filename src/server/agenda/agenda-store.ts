import { Agenda } from "./types";

export interface AgendaStore {
  getAgenda(conferenceId: string): Promise<Agenda>;
  storeAgenda(conferenceId: string, agenda: Agenda): Promise<void>;
}
