import { Maybe } from "../../utils/dynamo/maybe";
import { ConferenceId } from "../conference/conference-id";
import { AgendaReadService } from "./agenda-read-service";
import { AgendaStore } from "./agenda-store";
import { AgendaWriteService } from "./agenda-write-service";
import { Agenda, TimeSlotDetails, TrackDetails } from "./types";
import { randomUUID } from "node:crypto";
export class AgendaService implements AgendaWriteService, AgendaReadService {
  constructor(private readonly agendaStore: AgendaStore) {}
  async getAgenda(conferenceId: ConferenceId): Promise<Maybe<Agenda>> {
    return await this.agendaStore.getAgenda(conferenceId);
  }

  async addTimeSlot(
    conferenceId: ConferenceId,
    timeSlotDetails: Omit<TimeSlotDetails, "timeSlotId">,
  ): Promise<TimeSlotDetails> {
    const maybeAgenda = await this.agendaStore.getAgenda(conferenceId);
    if (!maybeAgenda.hasValue()) {
      throw maybeAgenda.error;
    }
    const agenda = maybeAgenda.value;

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
    conferenceId: ConferenceId,
    details: Omit<TrackDetails, "trackId">,
  ): Promise<TrackDetails> {
    const maybeAgenda = await this.agendaStore.getAgenda(conferenceId);
    if (!maybeAgenda.hasValue()) {
      throw maybeAgenda.error;
    }
    const agenda = maybeAgenda.value;
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
