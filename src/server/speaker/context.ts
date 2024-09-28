import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Config } from "../../config";
import { DynamoSpeakerStore } from "./dynamo-speaker-store";
import { SpeakerService } from "./speaker-service";
import { SpeakerWriteService } from "./speaker-write-service";
import { SpeakerReadService } from "./speaker-read-service";
import { SpeakerValidator } from "./speaker-validator";
export function initialiseSpeakerContext(
  config: Config,
  dynamoDocumentClient: DynamoDBDocumentClient,
) {
  const store = new DynamoSpeakerStore(config, dynamoDocumentClient);
  const speakerService = new SpeakerService(store);
  const speakerValidator = new SpeakerValidator(store);
  return {
    speakerWriteService: speakerService as SpeakerWriteService,
    speakerReadService: speakerService as SpeakerReadService,
    speakerValidator,
  };
}
