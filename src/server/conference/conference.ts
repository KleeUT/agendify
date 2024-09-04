import { ConferenceId } from "./conference-id";

export interface ConferenceLocation {
  building: string;
  street: string;
  suburb: string;
}
export interface ConferenceCreationRequest {
  name: string;
  location: ConferenceLocation;
}
export interface ConferenceUpdateRequest {
  conferenceId: ConferenceId;
  name?: string;
  location: Partial<ConferenceLocation>;
}

export interface ConferenceDetails {
  name: string;
  conferenceId: ConferenceId;
  location: ConferenceLocation;
}
