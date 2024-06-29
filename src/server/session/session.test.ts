import { describe, test, expect, vi, beforeEach } from "vitest";
import { aMockDynamoClient } from "../test-utils/dynamo-client";
import { SessionService } from "./session-service";
import { DynamoSessionStore } from "../dynamo";
import { fakeConfig } from "../test-utils/config";
import { SessionDetails } from "../../../types/domain/session";

describe("session", () => {
  const conferenceId = "conferenceId1";
  const speakerId1 = "speaker1";
  const sessionId1 = "sessionId1";
  beforeEach(() => {
    vi.resetAllMocks();
  });
  test("can add a session", () => {
    vi.mock("crypto", () => ({
      randomUUID: () => "1-2-3-4-5-6",
    }));

    const mockSend = vi.fn();
    const dynamoClient = aMockDynamoClient(mockSend);
    mockSend.mockResolvedValue({});
    const sessionStore = new DynamoSessionStore(fakeConfig, dynamoClient);
    const service = new SessionService(sessionStore);
    service.saveSession({
      conferenceId,
      abstract: "abstract",
      sessionId: "1-2-3-4-5-6",
      speakerIds: [speakerId1],
      tags: ["tag"],
      title: "title",
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          TableName: fakeConfig.conferenceTable,
          Item: {
            abstract: "abstract",
            speakerIds: [speakerId1],
            tags: ["tag"],
            title: "title",
            pk: "CONF#conferenceId1",
            sk: "SESSION#1-2-3-4-5-6",
            sessionId: "1-2-3-4-5-6",
          },
        },
      }),
    );
  });

  test("can get a session", async () => {
    const mockSend = vi.fn();
    const dynamoClient = aMockDynamoClient(mockSend);
    mockSend.mockResolvedValue({});
    const sessionStore = new DynamoSessionStore(fakeConfig, dynamoClient);
    const service = new SessionService(sessionStore);

    mockSend.mockResolvedValue({
      Item: {
        abstract: "abstractly",
        speakerIds: [speakerId1],
        tags: ["tag1"],
        title: "session-title",
        pk: "CONF#conferenceId1",
        sk: `SESSION#${sessionId1}`,
        sessionId: sessionId1,
      },
    });

    const session = await service.getSession({
      conferenceId,
      sessionId: sessionId1,
    });
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          Key: {
            pk: "CONF#conferenceId1",
            sk: `SESSION#${sessionId1}`,
          },
          TableName: fakeConfig.conferenceTable,
        },
      }),
    );

    expect(session).toEqual({
      conferenceId,
      sessionId: sessionId1,
      speakerIds: [speakerId1],
      title: "session-title",
      abstract: "abstractly",
      tags: ["tag1"],
    });
  });

  test("can get all sessions in conference", async () => {
    const mockSend = vi.fn();
    const dynamoClient = aMockDynamoClient(mockSend);
    const sessionStore = new DynamoSessionStore(fakeConfig, dynamoClient);
    const service = new SessionService(sessionStore);

    mockSend.mockResolvedValue({
      Items: [
        {
          abstract: { S: "abstractly" },
          pk: { S: "CONF#conferenceId1" },
          sk: { S: `SESSION#${sessionId1}` },
          sessionId: { S: sessionId1 },
          title: { S: "session-title" },
          speakerIds: { SS: [speakerId1] },
          tags: { SS: ["tag1"] },
        },
      ],
    });

    const sessions = await service.getAllSessions({
      conferenceId,
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          TableName: fakeConfig.conferenceTable,
          KeyConditionExpression: `pk = :pk and begins_with(sk, :sk)`,
          ExpressionAttributeValues: {
            ":pk": { S: `CONF#${conferenceId}` },
            ":sk": { S: "SESSION#" },
          },
        },
      }),
    );

    const sessionDetails: Array<SessionDetails> = [
      {
        abstract: "abstractly",
        speakerIds: [speakerId1],
        tags: ["tag1"],
        title: "session-title",
        conferenceId: "conferenceId1",
        sessionId: sessionId1,
      },
    ];
    expect(sessions).toEqual(sessionDetails);
  });
});
