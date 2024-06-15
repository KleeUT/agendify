import { SessionDetails, SessionModel } from "../../../types/domain/session";
import { SessionStore } from "../session/session-store";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { Config } from "../../config";
import { partitionKeyFor } from "./utils";

let dynamoClient: DynamoDBClient;

const SORT_KEY_PREFIX = "SPEAKER#";

const sortKey = (sessionId: string) => `${SORT_KEY_PREFIX}${sessionId}`;

export class DynamoSessionStore implements SessionStore {
  private readonly dynamoDocumentClient: DynamoDBDocumentClient;
  constructor(private readonly config: Config) {
    if (!dynamoClient) {
      dynamoClient = new DynamoDBClient();
    }
    this.dynamoDocumentClient = DynamoDBDocumentClient.from(dynamoClient);
  }
  async addSession(session: SessionModel): Promise<void> {
    const putCommand = new PutCommand({
      TableName: this.config.conferenceTable,
      Item: {
        pk: partitionKeyFor(session.conferenceId),
        sk: sortKey(session.sessionId),
        speakerIds: session.speakerIds,
        title: session.title,
        abstract: session.abstract,
        tags: session.tags,
      },
    });
    await this.dynamoDocumentClient.send(putCommand);
  }

  async getSession({
    conferenceId,
    sessionId,
  }: {
    conferenceId: string;
    sessionId: string;
  }): Promise<SessionDetails> {
    const getCommand = new GetCommand({
      TableName: this.config.conferenceTable,
      Key: {
        pk: partitionKeyFor(conferenceId),
        sk: sortKey(sessionId),
      },
    });

    const getResponse = await this.dynamoDocumentClient.send(getCommand);
    if (getResponse.Item) {
      return getResponse.Item as SessionModel; // TODO get the details out correctly
    }
    console.log(`item not found for ${conferenceId} speaker ${sessionId}`);
    throw new Error(`item not found for ${conferenceId} speaker ${sessionId}`);
  }
}
