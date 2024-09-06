import { describe, test, expect, vi, Mock, beforeEach } from "vitest";
import { SpeakerService } from "./speaker-service";
import { DynamoSpeakerStore } from "./dynamo-speaker-store";
import { fakeConfig } from "../test-utils/config";
import { aMockDynamoClient } from "../test-utils/dynamo-client";
import { partitionKeyFor } from "../../utils/dynamo/key-utils";
import { ConferenceId } from "../conference/conference-id";
import { SpeakerId } from "./speaker-id";

const conferenceId = ConferenceId.parse("conferenceId1");
const speaker1Id = SpeakerId.parse("speaker1");

describe("speaker service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  function setUpSpeakerService(): { service: SpeakerService; mockSend: Mock } {
    const mockSend = vi.fn();
    const dynamoClient = aMockDynamoClient(mockSend);
    const store = new DynamoSpeakerStore(fakeConfig, dynamoClient);
    return {
      service: new SpeakerService(store),
      mockSend,
    };
  }
  function returnASingleSpeaker(mockSend: Mock) {
    mockSend.mockResolvedValue({
      Item: {
        bio: "bio",
        socials: ["https://twitter.com"],
        sk: `SPEAKER#${speaker1Id}`,
        pk: `CONF#${conferenceId}`,
        speakerId: speaker1Id,
        picture: "https://pic",
        name: "Test Speaker",
      },
    });
  }
  test("should load speaker for conference", async () => {
    const { service, mockSend } = setUpSpeakerService();
    returnASingleSpeaker(mockSend);
    const returnedSpeaker = await service.getSpeaker(conferenceId, speaker1Id);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          TableName: fakeConfig.conferenceTable,
          Key: {
            pk: partitionKeyFor(conferenceId),
            sk: `SPEAKER#${speaker1Id}`,
          },
        },
      }),
    );

    expect(returnedSpeaker).toEqual({
      bio: "bio",
      socials: ["https://twitter.com"],
      speakerId: speaker1Id,
      picture: "https://pic",
      name: "Test Speaker",
      employer: undefined,
      jobTitle: undefined,
    });
  });

  test("should add a speaker to the conference", async () => {
    const { service, mockSend } = setUpSpeakerService();
    mockSend.mockResolvedValue({ ignored: true });
    vi.mock("crypto", () => ({
      randomUUID: () => "1-2-3-4-5-6",
    }));
    await service.addSpeaker(conferenceId, {
      bio: "bio",
      socials: ["https://twitter.com"],
      picture: "https://pic",
      name: "Test Speaker",
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          TableName: fakeConfig.conferenceTable,
          Item: {
            pk: partitionKeyFor(conferenceId),
            bio: "bio",
            socials: ["https://twitter.com"],
            picture: "https://pic",
            name: "Test Speaker",
            id: "1-2-3-4-5-6",
            sk: "SPEAKER#1-2-3-4-5-6",
          },
        },
      }),
    );
  });
  test("should get all speakers for a conference", async () => {
    const { service, mockSend } = setUpSpeakerService();
    mockSend.mockResolvedValue({
      Items: [
        {
          bio: { S: "biography" },
          socials: { SS: ["social1"] },
          id: { S: "speakerId" },
          picture: { S: "http://picture" },
          name: { S: "name-surname" },
          pk: { S: "pk:conferenceId" },
          sk: { S: "sk:speakerId" },
        },
      ],
    });
    const allSpeakers = await service.getAllSpeakers(conferenceId);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          TableName: fakeConfig.conferenceTable,
          KeyConditionExpression: `pk = :pk and begins_with(sk, :sk)`,
          ExpressionAttributeValues: {
            ":pk": { S: partitionKeyFor(conferenceId) },
            ":sk": { S: "SPEAKER#" },
          },
        },
      }),
    );
    expect(allSpeakers).toEqual([
      {
        bio: "biography",
        socials: ["social1"],
        speakerId: SpeakerId.parse("speakerId"),
        name: "name-surname",
        picture: "http://picture",
        jobTitle: "missing",
        employer: "missing",
      },
    ]);
  });
  test("Delete session", () => {
    const mockSend = vi.fn();
    const dynamoClient = aMockDynamoClient(mockSend);
    const speakerStore = new DynamoSpeakerStore(fakeConfig, dynamoClient);
    const service = new SpeakerService(speakerStore);
    service.deleteSpeaker(conferenceId, speaker1Id);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          TableName: fakeConfig.conferenceTable,
          Key: {
            pk: `CONF#${conferenceId}`,
            sk: `SPEAKER#${speaker1Id}`,
          },
        },
      }),
    );
  });
});
