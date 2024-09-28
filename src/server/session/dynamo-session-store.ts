import { SessionStore } from "../session/session-store";

import type { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Config } from "../../config";
import { partitionKeyFor } from "../../utils/dynamo";
import { AttributeValue, QueryCommand } from "@aws-sdk/client-dynamodb";
import { ConferenceId } from "../conference/conference-id";
import { SessionId } from "../session/session-id";
import { SessionDetails } from "../session/session";
import { SpeakerId } from "../speaker/speaker-id";
import { Maybe } from "../../utils/maybe";
import { NoItem } from "../../utils/dynamo/no-item";

type DynamoObject = {
  pk: string;
  sk: string;
  abstract: string;
  speakerIds: [string];
  title: string;
  tags: [string];
  sessionId: string;
};

const SORT_KEY_PREFIX = "SESSION#";

const sortKey = (sessionId: SessionId) =>
  `${SORT_KEY_PREFIX}${sessionId.toString()}`;

export class DynamoSessionStore implements SessionStore {
  constructor(
    private readonly config: Config,
    private readonly dynamoDocumentClient: DynamoDBDocumentClient,
  ) {}

  async addSession(session: SessionDetails): Promise<void> {
    const putCommand = new PutCommand({
      TableName: this.config.conferenceTable,
      Item: {
        pk: partitionKeyFor(session.conferenceId),
        sk: sortKey(session.sessionId),
        speakerIds: session.speakerIds.map((x) => x.toString()),
        title: session.title,
        abstract: session.abstract,
        tags: session.tags,
        sessionId: session.sessionId.toString(),
      },
    });
    await this.dynamoDocumentClient.send(putCommand);
  }

  async getSession(
    conferenceId: ConferenceId,
    sessionId: SessionId,
  ): Promise<Maybe<SessionDetails>> {
    const getCommand = new GetCommand({
      TableName: this.config.conferenceTable,
      Key: {
        pk: partitionKeyFor(conferenceId),
        sk: sortKey(sessionId),
      },
    });

    const getResponse = await this.dynamoDocumentClient.send(getCommand);
    if (getResponse.Item) {
      return Maybe.withValue(
        convertDynamoObjectToDetails(
          getResponse.Item as DynamoObject,
          conferenceId,
        ),
      );
    }
    console.log(`item not found for ${conferenceId} speaker ${sessionId}`);
    return Maybe.withError(
      new NoItem(
        `item not found for ${conferenceId} speaker ${sessionId}`,
        "session",
        [],
      ),
    );
  }

  async getAllSessions(conferenceId: ConferenceId): Promise<SessionDetails[]> {
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
  async deleteSession(
    conferenceId: ConferenceId,
    sessionId: SessionId,
  ): Promise<void> {
    const deleteCommand = new DeleteCommand({
      TableName: this.config.conferenceTable,
      Key: {
        pk: partitionKeyFor(conferenceId),
        sk: sortKey(sessionId),
      },
    });
    await this.dynamoDocumentClient.send(deleteCommand);
  }
}

function convertQueryResponseItemToDetails(
  item: Record<string, AttributeValue>,
  conferenceId: ConferenceId,
): SessionDetails {
  return {
    abstract: item.abstract?.S || "unknown",
    title: item.title?.S || "unknown",
    sessionId: SessionId.parse(item.sessionId?.S || "unknown"),
    tags: item.tags?.SS || [],
    speakerIds: (item.speakerIds?.SS || []).map(SpeakerId.parse),
    conferenceId,
  };
}

function convertDynamoObjectToDetails(
  obj: DynamoObject,
  conferenceId: ConferenceId,
): SessionDetails {
  return {
    conferenceId,
    sessionId: SessionId.parse(obj.sessionId),
    abstract: obj.abstract,
    speakerIds: obj.speakerIds.map(SpeakerId.parse),
    tags: obj.tags,
    title: obj.title,
  };
}
