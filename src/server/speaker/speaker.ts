import { SpeakerId } from "./speaker-id";

export interface SpeakerDetails {
  speakerId: SpeakerId;
  name: string;
  bio: string;
  picture?: string;
  jobTitle?: string;
  employer?: string;
  socials: Array<string>;
}
