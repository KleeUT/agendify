import { describe, test, expect, vi, Mock, beforeEach } from "vitest";
import { ConferenceService } from "./conference-service";
import { DynamoConferenceStore } from "../dynamo";
import { Config } from "../../config";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientResolvedConfig } from "@aws-sdk/client-dynamodb";
import { ConferenceDetails } from "../../../types/domain/conference";

const conferenceId1 = "conferenceId1";
const conferenceId2 = "conferenceId2";

describe("conference", () => {
  function givenAConferenceService(): {
    fakeConfig: Config;
    conferenceService: ConferenceService;
    mockSendFunction: Mock;
  } {
    const fakeConfig: Config = {
      conferenceTable: "faketable",
    };
    const mockSendFunction = vi.fn();
    const client: DynamoDBDocumentClient = {
      config: {} as unknown as DynamoDBClientResolvedConfig,
      destroy: vi.fn(),
      send: mockSendFunction as DynamoDBDocumentClient["send"],
    } as unknown as DynamoDBDocumentClient;

    const dynamoConferenceStore = new DynamoConferenceStore(fakeConfig, client);
    const conferenceService = new ConferenceService(dynamoConferenceStore);
    return { conferenceService, mockSendFunction, fakeConfig };
  }

  function dynamoConference(conferenceId: string) {
    return {
      suburb: {
        S: "suburb",
      },
      confId: {
        S: conferenceId,
      },
      sk: {
        S: `CONF#${conferenceId}`,
      },
      address: {
        S: "street",
      },
      building: {
        S: "building",
      },
      pk: {
        S: `CONF#${conferenceId}`,
      },
      name: {
        S: "name",
      },
    };
  }

  beforeEach(() => {
    vi.resetAllMocks();
  });
  test("get conference by id", async () => {
    const { conferenceService, mockSendFunction, fakeConfig } =
      givenAConferenceService();
    const returnedConference = {
      suburb: {
        S: "suburb",
      },
      confId: {
        S: conferenceId1,
      },
      sk: {
        S: "CONF#conferenceId1",
      },
      address: {
        S: "street",
      },
      building: {
        S: "building",
      },
      pk: {
        S: "CONF#conferenceId1",
      },
      name: {
        S: "name",
      },
    };
    const expectedConference: ConferenceDetails = {
      name: "name",
      id: conferenceId1,
      location: {
        building: "building",
        street: "street",
        suburb: "suburb",
      },
    };
    mockSendFunction.mockReturnValue({
      Items: [returnedConference],
    });
    const conference = await conferenceService.getConference(conferenceId1);
    expect(mockSendFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          TableName: fakeConfig.conferenceTable,
          KeyConditionExpression: `pk = :pk AND begins_with(sk, :sk)`,
          ExpressionAttributeValues: {
            ":sk": { S: "CONF#conferenceId1" },
            ":pk": { S: "CONF#conferenceId1" },
          },
        },
      }),
    );
    expect(conference).toEqual(expectedConference);
  });

  test("Create a conference", async () => {
    vi.mock("crypto", () => ({
      randomUUID: () => "1-2-3-4-5-6",
    }));
    // md.mockImplementation(() => "1-2-3-4-5-6");
    const { conferenceService, mockSendFunction, fakeConfig } =
      givenAConferenceService();

    conferenceService.addConference({
      location: {
        building: "new building",
        street: "new street",
        suburb: "new suburb",
      },
      name: "conferenceName",
    });

    expect(mockSendFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          TableName: fakeConfig.conferenceTable,
          Item: {
            pk: "CONF#1-2-3-4-5-6",
            sk: "CONF#1-2-3-4-5-6",
            building: "new building",
            address: "new street",
            suburb: "new suburb",
            confId: "1-2-3-4-5-6",
            name: "conferenceName",
          },
        },
      }),
    );
  });

  test("Should get all conferences", async () => {
    const { conferenceService, mockSendFunction, fakeConfig } =
      givenAConferenceService();
    const returnedConference1 = dynamoConference(conferenceId1);
    const returnedConference2 = dynamoConference(conferenceId2);
    const expectedConference: ConferenceDetails = {
      name: "name",
      id: conferenceId1,
      location: {
        building: "building",
        street: "street",
        suburb: "suburb",
      },
    };
    const expectedConference2: ConferenceDetails = {
      name: "name",
      id: conferenceId2,
      location: {
        building: "building",
        street: "street",
        suburb: "suburb",
      },
    };
    mockSendFunction.mockReturnValue({
      Items: [returnedConference1, returnedConference2],
    });
    const conference = await conferenceService.getAllConferences();
    expect(mockSendFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          TableName: fakeConfig.conferenceTable,
          FilterExpression: `begins_with(pk, :pk)`,
          ExpressionAttributeValues: {
            ":sk": { S: "CONF#" },
          },
        },
      }),
    );
    expect(conference).toEqual([expectedConference, expectedConference2]);
  });
});
