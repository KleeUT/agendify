import { AgendaReadService } from "./agenda-read-service";
import { AgendaStore } from "./agenda-store";
import { AgendaWriteService } from "./agenda-write-service";
import { Agenda, TimeSlotDetails, TrackDetails } from "./types";
import { randomUUID } from "node:crypto";
export class AgendaService implements AgendaWriteService, AgendaReadService {
  constructor(private readonly agendaStore: AgendaStore) {}
  async getAgenda(conferenceId: string): Promise<Agenda> {
    return await this.agendaStore.getAgenda(conferenceId);
  }

  async addTimeSlot(
    conferenceId: string,
    timeSlotDetails: Omit<TimeSlotDetails, "timeSlotId">,
  ): Promise<TimeSlotDetails> {
    const agenda = await this.agendaStore.getAgenda(conferenceId);
    const timeSlotId = randomUUID();
    const details: TimeSlotDetails = {
      timeSlotId,
      start: timeSlotDetails.start,
      stop: timeSlotDetails.stop,
      allocations: [],
    };
    agenda.allocations.push(details);
    await this.agendaStore.storeAgenda(conferenceId, agenda);
    return details;
  }

  async addTrack(
    conferenceId: string,
    details: Omit<TrackDetails, "trackId">,
  ): Promise<TrackDetails> {
    const agenda = await this.agendaStore.getAgenda(conferenceId);
    const trackId = randomUUID();
    const trackDetails: TrackDetails = {
      location: details.location,
      name: details.name,
      trackId,
    };
    agenda.trackData.push(trackDetails);
    await this.agendaStore.storeAgenda(conferenceId, agenda);
    return trackDetails;
  }
}
