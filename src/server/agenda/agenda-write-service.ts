import { TimeSlotDetails, TrackDetails } from "./types";

export interface AgendaWriteService {
  addTimeSlot(
    conferenceId: string,
    timeSlotDetails: Omit<Omit<TimeSlotDetails, "timeSlotId">, "allocations">,
  ): Promise<TimeSlotDetails>;
  addTrack(
    conferenceId: string,
    trackDetails: Omit<TrackDetails, "trackId">,
  ): Promise<TrackDetails>;
}
