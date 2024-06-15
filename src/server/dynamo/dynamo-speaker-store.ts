import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SpeakerModel } from "../../../types/domain/speaker";
import { SpeakerStore } from "../speaker/speaker-store";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { Config } from "../../config";
import { partitionKeyFor } from "./utils";

let dynamoClient: DynamoDBClient;

const SORT_KEY_PREFIX = "SPEAKER#";

const sortKey = (speakerId: string) => `${SORT_KEY_PREFIX}${speakerId}`;

export class DynamoSpeakerStore implements SpeakerStore {
  private readonly dynamoDocumentClient: DynamoDBDocumentClient;
  constructor(private readonly config: Config) {
    if (!dynamoClient) {
      dynamoClient = new DynamoDBClient();
    }
    this.dynamoDocumentClient = DynamoDBDocumentClient.from(dynamoClient);
  }
  async addSpeaker(model: SpeakerModel): Promise<void> {
    const putCommand = new PutCommand({
      TableName: this.config.conferenceTable,
      Item: {
        pk: partitionKeyFor(model.conferenceId),
        sk: sortKey(model.id),
        id: model.id,
        name: model.name,
        bio: model.bio,
        picture: model.picture,
        socials: model.socials,
      },
    });

    await this.dynamoDocumentClient.send(putCommand);
  }
  async getSpeaker({
    conferenceId,
    speakerId,
  }: {
    conferenceId: string;
    speakerId: string;
  }): Promise<SpeakerModel> {
    const getCommand = new GetCommand({
      TableName: this.config.conferenceTable,
      Key: {
        pk: partitionKeyFor(conferenceId),
        sk: sortKey(speakerId),
      },
    });

    const getResponse = await this.dynamoDocumentClient.send(getCommand);

    if (getResponse.Item) {
      return getResponse.Item as SpeakerModel; // TODO get the details out correctly
    }
    console.log(`item not found for ${conferenceId} speaker ${speakerId}`);
    throw new Error(`item not found for ${conferenceId} speaker ${speakerId}`);
  }
}
