import { Agenda } from "./types";

export interface AgendaReadService {
  getAgenda(conferenceId: string): Promise<Agenda>;
}
