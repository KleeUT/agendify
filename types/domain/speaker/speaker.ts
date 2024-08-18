export interface SpeakerDetails {
  speakerId: string;
  name: string;
  bio: string;
  picture?: string;
  jobTitle?: string;
  employer?: string;
  socials: Array<string>;
}
