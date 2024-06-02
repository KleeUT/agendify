import { ConferenceDetails } from "../../../types/domain/conference";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { Config } from "../../config";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { ConferenceStore } from "../conference/conference-store";
import { partitionKeyFor } from "./utils";

const SORT_KEY_PREFIX = "CONF#";

let dynamoClient: DynamoDBClient;
export class DynamoConferenceStore implements ConferenceStore {
  private readonly dynamoDocumentClient: DynamoDBDocumentClient;
  constructor(private readonly config: Config) {
    if (!dynamoClient) {
      dynamoClient = new DynamoDBClient();
    }
    this.dynamoDocumentClient = DynamoDBDocumentClient.from(dynamoClient);
  }

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
        ":sk": { S: SORT_KEY_PREFIX },
        ":pk": { S: partitionKeyFor(conferenceId) },
      },
    });

    const queryResponse = await this.dynamoDocumentClient.send(getRequest);

    if (queryResponse.Items?.length === 1) {
      console.log("response", queryResponse);
      return queryResponse.Items[0] as unknown as ConferenceDetails; // TODO get the details out correctly
    }
    console.log(`item not found for ${conferenceId}`);
    throw new Error(`item not found for ${conferenceId}`);
  }
}
