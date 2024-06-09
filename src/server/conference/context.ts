import {
  ConferenceReadService,
  ConferenceWriteService,
} from "../../../types/domain/conference";
import { Config } from "../../config";
import { ConferenceService } from "./conference-service";
import { DynamoConferenceStore } from "../dynamo/dynamo-conference-store";

export function initialise(config: Config): {
  conferenceWriteService: ConferenceWriteService;
  conferenceReadService: ConferenceReadService;
} {
  const conferenceService = new ConferenceService(
    new DynamoConferenceStore(config),
  );
  return {
    conferenceWriteService: conferenceService,
    conferenceReadService: conferenceService,
  };
}
