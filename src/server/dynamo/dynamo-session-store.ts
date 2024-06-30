import { SessionDetails, SessionModel } from "../../../types/domain/session";
import { SessionStore } from "../session/session-store";

import type { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Config } from "../../config";
import { partitionKeyFor } from "./utils";
import { AttributeValue, QueryCommand } from "@aws-sdk/client-dynamodb";

type DynamoObject = {
  abstract: string;
  speakerIds: [string];
  tags: [string];
  title: string;
  pk: string;
  sk: string;
  sessionId: string;
};

const SORT_KEY_PREFIX = "SESSION#";

const sortKey = (sessionId: string) => `${SORT_KEY_PREFIX}${sessionId}`;

export class DynamoSessionStore implements SessionStore {
  constructor(
    private readonly config: Config,
    private readonly dynamoDocumentClient: DynamoDBDocumentClient,
  ) {}

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
        sessionId: session.sessionId,
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
      return convertDynamoObjectToDetails(
        getResponse.Item as DynamoObject,
        conferenceId,
      );
    }
    console.log(`item not found for ${conferenceId} speaker ${sessionId}`);
    throw new Error(`item not found for ${conferenceId} speaker ${sessionId}`);
  }

  async getAllSessions(conferenceId: string): Promise<SessionDetails[]> {
    const queryResult = await this.dynamoDocumentClient.send(
      new QueryCommand({
        TableName: this.config.conferenceTable,
        KeyConditionExpression: `pk = :pk and begins_with(sk, :sk)`,
        ExpressionAttributeValues: {
          ":pk": { S: partitionKeyFor(conferenceId) },
          ":sk": { S: SORT_KEY_PREFIX },
        },
      }),
    );
    if (!queryResult.Items) {
      console.log(`No results for sessions in ${conferenceId}`);
      return [];
    }
    return queryResult.Items.map((item) =>
      convertQueryResponseItemToDetails(item, conferenceId),
    );
  }
}

function convertQueryResponseItemToDetails(
  item: Record<string, AttributeValue>,
  conferenceId: string,
): SessionDetails {
  return {
    abstract: item.abstract?.S || "unknown",
    title: item.title?.S || "unknown",
    sessionId: item.sessionId?.S || "unknown",
    tags: item.tags?.SS || [],
    speakerIds: item.speakerIds?.SS || [],
    conferenceId,
  };
}

function convertDynamoObjectToDetails(
  obj: DynamoObject,
  conferenceId: string,
): SessionDetails {
  return {
    conferenceId,
    sessionId: obj.sessionId,
    abstract: obj.abstract,
    speakerIds: obj.speakerIds,
    tags: obj.tags,
    title: obj.title,
  };
}
