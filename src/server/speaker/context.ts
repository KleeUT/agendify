import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import {
  SpeakerReadService,
  SpeakerWriteService,
} from "../../../types/domain/speaker";
import { Config } from "../../config";
import { DynamoSpeakerStore } from "../dynamo/dynamo-speaker-store";
import { SpeakerService } from "./speaker-service";
export function initialiseSpeakerContext(
  config: Config,
  dynamoDocumentClient: DynamoDBDocumentClient,
) {
  const store = new DynamoSpeakerStore(config, dynamoDocumentClient);
  const speakerService = new SpeakerService(store);
  return {
    speakerWriteService: speakerService as SpeakerWriteService,
    speakerReadService: speakerService as SpeakerReadService,
  };
}
