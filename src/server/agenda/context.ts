import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Config } from "../../config";
import { AgendaService } from "./agenda-service";
import { AgendaReadService } from "./agenda-read-service";
import { AgendaWriteService } from "./agenda-write-service";
import { InMemoryFakeAgendaStore } from "./dynamo-agenda-store";

export function initialiseAgendaContext(
  config: Config,
  dynamoDocumentClient: DynamoDBDocumentClient,
): {
  agendaReadService: AgendaReadService;
  agendaWriteService: AgendaWriteService;
} {
  const agendaStore = new InMemoryFakeAgendaStore(config, dynamoDocumentClient);
  const agendaService = new AgendaService(agendaStore);
  return {
    agendaReadService: agendaService,
    agendaWriteService: agendaService,
  };
}
