import { Config } from "../../config";

import { SessionService } from "./session-service";
import { DynamoSessionStore } from "./dynamo-session-store";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SessionWriteService } from "./session-write-service";
import { SessionReadService } from "./session-read-service";

export function initialiseSessionContext(
  config: Config,
  dynamoDocumentClient: DynamoDBDocumentClient,
): {
  sessionWriteService: SessionWriteService;
  sessionReadService: SessionReadService;
} {
  const sessionStore = new DynamoSessionStore(config, dynamoDocumentClient);
  const sessionService = new SessionService(sessionStore);

  return {
    sessionReadService: sessionService,
    sessionWriteService: sessionService,
  };
}
