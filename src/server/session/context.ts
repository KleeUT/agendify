import { Config } from "../../config";
import {
  SessionReadService,
  SessionWriteService,
} from "../../../types/domain/session";
import { SessionService } from "./session-service";
import { DynamoSessionStore } from "../dynamo";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

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
