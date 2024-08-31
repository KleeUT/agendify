import { Config } from "../../config";
import { AgendaStore } from "../agenda/agenda-store";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Agenda } from "../agenda/types";

export class InMemoryFakeAgendaStore implements AgendaStore {
  private agendas: Map<string, Agenda>;
  constructor(
    private readonly config: Config,
    private readonly dynamoDocumentClient: DynamoDBDocumentClient,
  ) {
    this.agendas = new Map();
  }
  getAgenda(conferenceId: string): Promise<Agenda> {
    let agenda = this.agendas.get(conferenceId);
    if (!agenda) {
      agenda = { allocations: [], trackData: [] };
      this.agendas.set(conferenceId, agenda);
    }
    return Promise.resolve(agenda);
  }
  storeAgenda(conferenceId: string, agenda: Agenda): Promise<void> {
    this.agendas.set(conferenceId, agenda);
    return Promise.resolve();
  }
}
