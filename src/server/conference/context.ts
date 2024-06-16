import {
  ConferenceReadService,
  ConferenceWriteService,
} from "../../../types/domain/conference";
import { Config } from "../../config";
import { ConferenceService } from "./conference-service";
import { DynamoConferenceStore } from "../dynamo/dynamo-conference-store";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export function initialise(config: Config): {
  conferenceWriteService: ConferenceWriteService;
  conferenceReadService: ConferenceReadService;
} {
  const dynamoDocumentClient = DynamoDBDocumentClient.from(
    new DynamoDBClient(),
  );
  const conferenceService = new ConferenceService(
    new DynamoConferenceStore(config, dynamoDocumentClient),
  );
  return {
    conferenceWriteService: conferenceService,
    conferenceReadService: conferenceService,
  };
}
