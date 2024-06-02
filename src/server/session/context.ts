import { Config } from "../../config";
import {
  SessionReadService,
  SessionWriteService,
} from "../../../types/domain/session";
import { SessionService } from "./session-service";
import { DynamoSessionStore } from "../dynamo";

export function initialiseSessionContext(config: Config): {
  sessionWriteService: SessionWriteService;
  sessionReadService: SessionReadService;
} {
  const sessionStore = new DynamoSessionStore(config);
  const sessionService = new SessionService(sessionStore);

  return {
    sessionReadService: sessionService,
    sessionWriteService: sessionService,
  };
}
