import {
  SpeakerReadService,
  SpeakerWriteService,
} from "../../../types/domain/speaker";
import { Config } from "../../config";
import { DynamoSpeakerStore } from "../dynamo/dynamo-speaker-store";
import { SpeakerService } from "./speaker-service";
export function initialiseSpeakerContext(config: Config) {
  const store = new DynamoSpeakerStore(config);
  const speakerService = new SpeakerService(store);
  return {
    speakerWriteService: speakerService as SpeakerWriteService,
    speakerReadService: speakerService as SpeakerReadService,
  };
}
