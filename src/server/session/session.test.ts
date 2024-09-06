import { describe, test, expect, vi, beforeEach } from "vitest";
import { aMockDynamoClient } from "../test-utils/dynamo-client";
import { SessionService } from "./session-service";
import { DynamoSessionStore } from "./dynamo-session-store";
import { fakeConfig } from "../test-utils/config";
import { SessionDetails } from "./session";
import { ConferenceId } from "../conference/conference-id";
import { SpeakerId } from "../speaker/speaker-id";
import { SessionId } from "./session-id";

describe("session", () => {
  const conferenceId = ConferenceId.parse("conferenceId1");
  const speakerId1 = SpeakerId.parse("speaker1");
  const sessionId1 = SessionId.parse("sessionId1");
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
            speakerIds: [speakerId1.toString()],
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
        speakerIds: [speakerId1.toString()],
        tags: ["tag1"],
        title: "session-title",
        pk: "CONF#conferenceId1",
        sk: `SESSION#${sessionId1.toString()}`,
        sessionId: sessionId1.toString(),
      },
    });

    const session = await service.getSession(conferenceId, sessionId1);
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
          sessionId: { S: sessionId1.toString() },
          title: { S: "session-title" },
          speakerIds: { SS: [speakerId1.toString()] },
          tags: { SS: ["tag1"] },
        },
      ],
    });

    const sessions = await service.getAllSessions(conferenceId);

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
        conferenceId: ConferenceId.parse("conferenceId1"),
        sessionId: sessionId1,
      },
    ];

    expect(sessions).toEqual(sessionDetails);
  });

  test("Delete session", () => {
    const mockSend = vi.fn();
    const dynamoClient = aMockDynamoClient(mockSend);
    const sessionStore = new DynamoSessionStore(fakeConfig, dynamoClient);
    const service = new SessionService(sessionStore);
    service.deleteSession(conferenceId, sessionId1);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          TableName: fakeConfig.conferenceTable,
          Key: {
            pk: `CONF#${conferenceId}`,
            sk: `SESSION#${sessionId1}`,
          },
        },
      }),
    );
  });
});
