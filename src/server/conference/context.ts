import { ConferenceReadService } from "../../../types/domain/conference-read-service";
import { ConferenceWriteService } from "../../../types/domain/conference-write-service";
import { Config } from "../../config";
import { ConferenceService } from "./conference-service";
import { DynamoConferenceStore } from "../dynamo/dynamo-conference-store";

export function initalise(config: Config): {
  conferenceWriteService: ConferenceWriteService;
  conferenceReadService: ConferenceReadService;
} {
  const conferenceService = new ConferenceService(
    new DynamoConferenceStore(config)
  );
  return {
    conferenceWriteService: conferenceService,
    conferenceReadService: conferenceService,
  };
}
