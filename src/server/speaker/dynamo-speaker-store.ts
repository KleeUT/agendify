import { AttributeValue, QueryCommand } from "@aws-sdk/client-dynamodb";
import { SpeakerStore } from "../speaker/speaker-store";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { Config } from "../../config";
import {
  createUpdateCommandFromModel,
  ModelKeyLookup,
  partitionKeyFor,
} from "../../utils/dynamo";
import { ConferenceId } from "../conference/conference-id";
import { SpeakerId } from "../speaker/speaker-id";
import { SpeakerDetails } from "../speaker/speaker";
import { Maybe } from "../../utils/maybe";
import { NoItem } from "../../utils/dynamo/no-item";

const SORT_KEY_PREFIX = "SPEAKER#";

const sortKey = (speakerId: SpeakerId) =>
  `${SORT_KEY_PREFIX}${speakerId.toString()}`;

export class DynamoSpeakerStore implements SpeakerStore {
  constructor(
    private readonly config: Config,
    private readonly dynamoDocumentClient: DynamoDBDocumentClient,
  ) {}

  async addSpeaker(
    conferenceId: ConferenceId,
    speakerDetails: SpeakerDetails,
  ): Promise<void> {
    const putCommand = new PutCommand({
      TableName: this.config.conferenceTable,
      Item: {
        pk: partitionKeyFor(conferenceId),
        sk: sortKey(speakerDetails.speakerId),
        id: speakerDetails.speakerId.toString(),
        name: speakerDetails.name,
        bio: speakerDetails.bio,
        picture: speakerDetails.picture,
        socials: speakerDetails.socials,
      },
    });

    await this.dynamoDocumentClient.send(putCommand);
  }

  async getSpeaker(
    conferenceId: ConferenceId,
    speakerId: SpeakerId,
  ): Promise<Maybe<SpeakerDetails>> {
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
      return Maybe.withValue(
        mapSpeakerModelToSpeakerDetails(getResponse.Item as SpeakerModel),
      );
    }
    console.log(`item not found for ${conferenceId} speaker ${speakerId}`);
    return Maybe.withError(
      new NoItem(
        `item not found for ${conferenceId} speaker ${speakerId}`,
        "speaker",
        [],
      ),
    );
  }

  async getAllSpeakers(conferenceId: ConferenceId): Promise<SpeakerDetails[]> {
    const queryCommand = new QueryCommand({
      TableName: this.config.conferenceTable,
      KeyConditionExpression: `pk = :pk and begins_with(sk, :sk)`,
      ExpressionAttributeValues: {
        ":pk": { S: partitionKeyFor(conferenceId) },
        ":sk": { S: SORT_KEY_PREFIX },
      },
    });
    const dynamoResponse = await this.dynamoDocumentClient.send(queryCommand);
    if (!dynamoResponse.Items) {
      console.log(`No items found`, { conferenceId });
      return [];
    }
    return dynamoResponse.Items.map((item) =>
      mapSpeakerModelToSpeakerDetails(
        mapDynamoQueryResponseToSpeakerModel(item),
      ),
    );
  }

  async deleteSpeaker(
    conferenceId: ConferenceId,
    speakerId: SpeakerId,
  ): Promise<void> {
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
    conferenceId: ConferenceId,
    speakerDetails: Partial<SpeakerDetails> & Pick<SpeakerDetails, "speakerId">,
  ): Promise<void> {
    console.log("writing", speakerDetails);
    const updateCommand = createUpdateCommandFromModel({
      model: speakerDetails,
      tableName: this.config.conferenceTable,
      lookUp,
      key: {
        pk: partitionKeyFor(conferenceId),
        sk: sortKey(speakerDetails.speakerId),
      },
    });
    console.log(updateCommand.input);
    await this.dynamoDocumentClient.send(updateCommand);
  }
}

const lookUp: ModelKeyLookup<SpeakerModel> = {
  bio: "bio",
  socials: "socials",
  speakerId: "speakerId",
  picture: "picture",
  jobTitle: "jobTitle",
  employer: "employer",
  name: "name",
  pk: "pk",
  sk: "sk",
};

function mapDynamoQueryResponseToSpeakerModel(
  item: Record<string, AttributeValue>,
): SpeakerModel {
  console.log(item);
  return {
    pk: item.pk?.S || "missing",
    sk: item.sk?.S || "missing",
    bio: item.bio?.S || "missing",
    socials: item.socials?.SS || [],
    speakerId: SpeakerId.parse(item.id?.S || "missing"),
    picture: item.picture?.S || "missing",
    name: item.name?.S || "missing",
    jobTitle: item.jobTitle?.S || "missing",
    employer: item.employer?.S || "missing",
  };
}

function mapSpeakerModelToSpeakerDetails(model: SpeakerModel): SpeakerDetails {
  return {
    bio: model.bio,
    socials: model.socials,
    speakerId: model.id ? SpeakerId.parse(model.id) : model.speakerId,
    picture: model.picture,
    name: model.name,
    jobTitle: model.jobTitle,
    employer: model.employer,
  };
}

type SpeakerModel = {
  bio: string;
  socials: Array<string>;
  sk: string;
  pk: string;
  speakerId: SpeakerId;
  picture: string;
  name: string;
  jobTitle?: string;
  employer?: string;
  id?: string; // todo remove
};
