import { Config } from "../config";
import { initialise as initialiseConferenceContext } from "./conference/context";
import { initialiseSpeakerContext } from "./speaker/context";
import { initialiseSessionContext } from "./session/context";

export function initialise(config: Config) {
  const conferenceContext = initialiseConferenceContext(config);
  const speakerContext = initialiseSpeakerContext(config);
  const sessionContext = initialiseSessionContext(config);
  return { ...conferenceContext, ...speakerContext, ...sessionContext };
}
