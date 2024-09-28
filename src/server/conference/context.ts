import { Config } from "../../config";
import { ConferenceService } from "./conference-service";
import { DynamoConferenceStore } from "./dynamo-conference-store";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ConferenceWriteService } from "./conference-write-service";
import { ConferenceReadService } from "./conference-read-service";
import { ConferenceValidator } from "./conference-validator";

export function initialise(
  config: Config,
  dynamoDocumentClient: DynamoDBDocumentClient,
): {
  conferenceWriteService: ConferenceWriteService;
  conferenceReadService: ConferenceReadService;
  conferenceValidator: ConferenceValidator;
} {
  const store = new DynamoConferenceStore(config, dynamoDocumentClient);
  const conferenceService = new ConferenceService(store);
  const conferenceValidator = new ConferenceValidator(store);
  return {
    conferenceWriteService: conferenceService,
    conferenceReadService: conferenceService,
    conferenceValidator,
  };
}
