import { ConferenceId } from "../conference/conference-id";
import { TimeSlotDetails, TrackDetails } from "./types";

export interface AgendaWriteService {
  addTimeSlot(
    conferenceId: ConferenceId,
    timeSlotDetails: Omit<Omit<TimeSlotDetails, "timeSlotId">, "allocations">,
  ): Promise<TimeSlotDetails>;
  addTrack(
    conferenceId: ConferenceId,
    trackDetails: Omit<TrackDetails, "trackId">,
  ): Promise<TrackDetails>;
}
