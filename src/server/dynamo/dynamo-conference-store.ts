import { ConferenceDetails } from "../../../types/domain/conference";
import {
  AttributeValue,
  BatchWriteItemCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { Config } from "../../config";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ConferenceStore } from "../conference/conference-store";
import { PARTITION_KEY_PREFIX, partitionKeyFor } from "./utils";

type DynamoConferenceReturnType = {
  suburb: {
    S: string;
  };
  confId: {
    S: string;
  };
  sk: {
    S: string;
  };
  address: {
    S: string;
  };
  building: {
    S: string;
  };
  pk: {
    S: string;
  };
  name: {
    S: string;
  };
};
export class DynamoConferenceStore implements ConferenceStore {
  constructor(
    private readonly config: Config,
    private readonly dynamoDocumentClient: DynamoDBDocumentClient,
  ) {}

  async storeConference(model: ConferenceDetails): Promise<void> {
    const putRequest = new PutCommand({
      TableName: this.config.conferenceTable,
      Item: {
        pk: partitionKeyFor(model.id),
        sk: partitionKeyFor(model.id),
        building: model.location.building,
        address: model.location.street,
        suburb: model.location.suburb,
        confId: model.id,
        name: model.name,
      },
    });
    await this.dynamoDocumentClient.send(putRequest);
  }

  async getConference(conferenceId: string): Promise<ConferenceDetails> {
    const getRequest = new QueryCommand({
      TableName: this.config.conferenceTable,
      KeyConditionExpression: `pk = :pk AND begins_with(sk, :sk)`,
      ExpressionAttributeValues: {
        ":sk": { S: partitionKeyFor(conferenceId) },
        ":pk": { S: partitionKeyFor(conferenceId) },
      },
    });

    const queryResponse = await this.dynamoDocumentClient.send(getRequest);

    if (queryResponse.Items?.length === 1) {
      return queryResponseToConferenceDetails(
        queryResponse.Items[0] as DynamoConferenceReturnType,
      );
    }
    console.log(`item not found for ${conferenceId}`);
    throw new Error(`item not found for ${conferenceId}`);
  }
  async getAllConferences(): Promise<ConferenceDetails[]> {
    const scanCommand = new ScanCommand({
      TableName: this.config.conferenceTable,
      FilterExpression: "begins_with(sk, :sk)",
      ExpressionAttributeValues: {
        ":sk": { S: PARTITION_KEY_PREFIX },
      },
    });

    const queryResponse = await this.dynamoDocumentClient.send(scanCommand);
    const conferences = queryResponse.Items?.map((x) =>
      queryResponseToConferenceDetails(x as DynamoConferenceReturnType),
    );
    return conferences || [];
  }
  async deleteConference(conferenceId: string): Promise<void> {
    const allConferenceItemsQuery = new QueryCommand({
      TableName: this.config.conferenceTable,
      KeyConditionExpression: "pk = :pkval",
      ExpressionAttributeValues: {
        ":pkval": { S: partitionKeyFor(conferenceId) },
      },
    });
    const queryResponse = await this.dynamoDocumentClient.send(
      allConferenceItemsQuery,
    );
    await this.bulkDelete(queryResponse.Items);
  }

  private async bulkDelete(items: Array<Record<string, AttributeValue>> = []) {
    const getResponse = await this.dynamoDocumentClient.send(
      new BatchWriteItemCommand({
        RequestItems: {
          [this.config.conferenceTable]: items.map((item) => ({
            DeleteRequest: {
              Key: {
                pk: item.pk,
                sk: item.sk,
              },
            },
          })),
        },
      }),
    );
    if (getResponse.UnprocessedItems) {
      console.warn(
        "There were unprocessed items",
        getResponse.UnprocessedItems,
      );
    }
  }
}

function queryResponseToConferenceDetails(
  queryResponse: DynamoConferenceReturnType,
): ConferenceDetails {
  return {
    name: queryResponse.name?.S || "Missing",
    id: queryResponse.confId?.S || "Missing",
    location: {
      building: queryResponse.building?.S || "Missing",
      street: queryResponse.address?.S || "Missing",
      suburb: queryResponse.suburb?.S || "Missing",
    },
  };
}
