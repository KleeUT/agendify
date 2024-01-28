import { Config } from "../config";
import { initalise as initaliseConferenceContext } from "./conference/context";
import { initialiseSpeakerContext } from "./speaker/context";

export function initalise(config: Config) {
  const conferenceContext = initaliseConferenceContext(config);
  const speakerContext = initialiseSpeakerContext(config);
  return { ...conferenceContext, ...speakerContext };
}
