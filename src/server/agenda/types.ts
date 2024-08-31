export type TimeSlotDetails = {
  start: Date;
  stop: Date;
  timeSlotId: string;
  allocations: Array<Allocation>;
};

export type TrackDetails = {
  trackId: string;
  name: string;
  location: string;
};

export type AllocationType = "singleTrack" | "keynote" | "break";

export type Allocation = {
  trackId: string;
  sessionId: string;
  type: AllocationType;
};

export type Agenda = {
  trackData: Array<TrackDetails>;
  allocations: Array<TimeSlotDetails>;
};
