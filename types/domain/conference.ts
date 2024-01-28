export interface ConferenceLocation {
  building: string;
  street: string;
  suburb: string;
}
export interface ConferenceCreationRequest {
  name: string;
  location: ConferenceLocation;
}

export interface ConferenceDetails {
  name: string;
  id: string;
  location: ConferenceLocation;
}
