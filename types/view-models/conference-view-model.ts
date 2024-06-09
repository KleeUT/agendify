export interface ConferenceAgendaTrackViewModel {
  number: number;
  name?: string;
  location: string;
}

export interface SessionDetailsViewModel {
  title: string;
  speakerName: string;
  speakerImage: string;
  sessionId: string;
}
export interface ConferenceAgendaTimeSlotViewModel {
  start: Date;
  end: Date;
}

export interface ConferenceDayAgendaViewModel {
  sessions: SessionDetailsViewModel[][];
  tracks: ConferenceAgendaTrackViewModel[];
  timeSlots: ConferenceAgendaTimeSlotViewModel[];
}

export interface ConferenceAgendaViewModel {
  days: ConferenceDayAgendaViewModel[];
}
