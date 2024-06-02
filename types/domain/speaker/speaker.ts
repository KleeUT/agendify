export interface SpeakerDetails {
  name: string;
  bio: string;
  picture?: string;
  socials: Array<string>;
}

export interface SpeakerModel {
  name: string;
  bio: string;
  socials: Array<string>;
  picture?: string;
  id: string;
  conferenceId: string;
}
