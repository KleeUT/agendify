import { Config } from "../../config";
import { AgendaStore } from "./agenda-store";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { Agenda } from "./types";
import { partitionKeyFor } from "../../utils/dynamo";
import { ConferenceId } from "../conference/conference-id";
import { NoItem } from "../../utils/dynamo/no-item";
import { Maybe } from "../../utils/maybe";

type StoredAgenda = {
  pk: string;
  sk: string;
  conferenceId: string;
  agendaJson: string;
};

export class InMemoryFakeAgendaStore implements AgendaStore {
  private readonly sortKey = "Agenda#";
  constructor(
    private readonly config: Config,
    private readonly dynamoDocumentClient: DynamoDBDocumentClient,
  ) {}

  async getAgenda(conferenceId: ConferenceId): Promise<Maybe<Agenda>> {
    const queryCommand = new GetCommand({
      TableName: this.config.conferenceTable,
      Key: {
        sk: { S: this.sortKey },
        pk: { S: partitionKeyFor(conferenceId) },
      },
    });

    const getResponse = await this.dynamoDocumentClient.send(queryCommand);
    const agendaResponseItem = getResponse.Item;
    if (agendaResponseItem) {
      return Maybe.withValue({ allocations: [], trackData: [] });
    }
    const agenda = this.storedAgendaToAgenda(getResponse.Item);
    if (!agenda) {
      return Maybe.withError(
        new NoItem(`No agenda found for ${conferenceId}`, "Agenda", [
          { conferenceId: conferenceId.toString() },
        ]),
      );
    }
    return Maybe.withValue(agenda);
  }

  private agendaToStoredAgenda(
    conferenceId: ConferenceId,
    agenda: Agenda,
  ): StoredAgenda {
    return {
      pk: partitionKeyFor(conferenceId),
      sk: this.sortKey,
      agendaJson: JSON.stringify(agenda),
      conferenceId: conferenceId.toString(),
    };
  }

  private storedAgendaToAgenda(
    stored?: Record<string, unknown>,
  ): Agenda | undefined {
    if (stored?.agendaJson) {
      return JSON.parse(stored?.agendaJson as string);
    }
    return undefined;
  }

  async storeAgenda(conferenceId: ConferenceId, agenda: Agenda): Promise<void> {
    const putCommand = new PutCommand({
      TableName: this.config.conferenceTable,
      Item: this.agendaToStoredAgenda(conferenceId, agenda),
    });
    await this.dynamoDocumentClient.send(putCommand);
  }
}
