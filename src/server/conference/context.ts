import {
  ConferenceReadService,
  ConferenceWriteService,
} from "../../../types/domain/conference";
import { Config } from "../../config";
import { ConferenceService } from "./conference-service";
import { DynamoConferenceStore } from "../dynamo/dynamo-conference-store";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export function initialise(
  config: Config,
  dynamoDocumentClient: DynamoDBDocumentClient,
): {
  conferenceWriteService: ConferenceWriteService;
  conferenceReadService: ConferenceReadService;
} {
  const conferenceService = new ConferenceService(
    new DynamoConferenceStore(config, dynamoDocumentClient),
  );
  return {
    conferenceWriteService: conferenceService,
    conferenceReadService: conferenceService,
  };
}
