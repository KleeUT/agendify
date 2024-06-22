export interface SpeakerDetails {
  name: string;
  bio: string;
  picture?: string;
  socials: Array<string>;
}

export interface SpeakerModel {
  bio: string;
  socials: Array<string>;
  id: string;
  picture?: string;
  name: string;
  conferenceId: string;
}
