import { AttributeValue, QueryCommand } from "@aws-sdk/client-dynamodb";
import { SpeakerModel } from "../../../types/domain/speaker";
import { SpeakerStore } from "../speaker/speaker-store";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { Config } from "../../config";
import { partitionKeyFor } from "./utils";
import {
  createUpdateCommandFromModel,
  ModelKeyLookup,
} from "./create-update-command-from-model";

type SpeakerDynamoResponse = {
  bio: string;
  socials: Array<string>;
  sk: string;
  pk: string;
  id: string;
  picture: string;
  name: string;
  jobTitle?: string;
  employer?: string;
};

const SORT_KEY_PREFIX = "SPEAKER#";

const sortKey = (speakerId: string) => `${SORT_KEY_PREFIX}${speakerId}`;

export class DynamoSpeakerStore implements SpeakerStore {
  constructor(
    private readonly config: Config,
    private readonly dynamoDocumentClient: DynamoDBDocumentClient,
  ) {}
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
    console.log(getResponse);
    if (getResponse.Item) {
      return mapSpeakerResponseToSpeakerModel(
        getResponse.Item as SpeakerDynamoResponse,
        conferenceId,
      );
    }
    console.log(`item not found for ${conferenceId} speaker ${speakerId}`);
    throw new Error(`item not found for ${conferenceId} speaker ${speakerId}`);
  }

  async getAllSpeakers({
    conferenceId,
  }: {
    conferenceId: string;
  }): Promise<SpeakerModel[]> {
    const queryCommand = new QueryCommand({
      TableName: this.config.conferenceTable,
      KeyConditionExpression: `pk = :pk and begins_with(sk, :sk)`,
      ExpressionAttributeValues: {
        ":pk": { S: partitionKeyFor(conferenceId) },
        ":sk": { S: SORT_KEY_PREFIX },
      },
    });
    const dyanamoResponse = await this.dynamoDocumentClient.send(queryCommand);
    if (!dyanamoResponse.Items) {
      console.log(`No items found`, { conferenceId });
      return [];
    }
    return dyanamoResponse.Items.map((item) =>
      mapDynamoQueryResponseToSpeakerModel(item, conferenceId),
    );
  }
  async deleteSpeaker({
    conferenceId,
    speakerId,
  }: {
    conferenceId: string;
    speakerId: string;
  }): Promise<void> {
    const deleteCommand = new DeleteCommand({
      TableName: this.config.conferenceTable,
      Key: {
        pk: partitionKeyFor(conferenceId),
        sk: sortKey(speakerId),
      },
    });
    await this.dynamoDocumentClient.send(deleteCommand);
  }
  async updateSpeaker(
    model: Partial<SpeakerModel> &
      Pick<SpeakerModel, "id"> &
      Pick<SpeakerModel, "conferenceId">,
  ): Promise<void> {
    console.log("writing", model);
    const updateCommand = createUpdateCommandFromModel({
      model: model,
      tableName: this.config.conferenceTable,
      lookUp,
      key: {
        pk: partitionKeyFor(model.conferenceId),
        sk: sortKey(model.id),
      },
    });
    console.log(updateCommand.input);
    await this.dynamoDocumentClient.send(updateCommand);
  }
}

const lookUp: ModelKeyLookup<SpeakerModel> = {
  bio: "bio",
  socials: "socials",
  id: "id",
  picture: "picture",
  jobTitle: "jobTitle",
  employer: "employer",
  name: "name",
  conferenceId: "conferenceId",
};
``;

function mapDynamoQueryResponseToSpeakerModel(
  item: Record<string, AttributeValue>,
  conferenceId: string,
): SpeakerModel {
  console.log(item);
  return {
    bio: item.bio?.S || "missing",
    socials: item.socials?.SS || [],
    id: item.id?.S || "missing",
    picture: item.picture?.S || "missing",
    name: item.name?.S || "missing",
    conferenceId,
  };
}

function mapSpeakerResponseToSpeakerModel(
  response: SpeakerDynamoResponse,
  conferenceId: string,
): SpeakerModel {
  return {
    bio: response.bio,
    socials: response.socials,
    id: response.id,
    picture: response.picture,
    name: response.name,
    conferenceId,
  };
}
