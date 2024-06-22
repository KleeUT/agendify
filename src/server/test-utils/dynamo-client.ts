import { Mock } from "vitest";
import { DynamoDBClientResolvedConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export function aMockDynamoClient(mockSendFunction: Mock) {
  const partialCLient: Partial<DynamoDBDocumentClient> = {
    config: {} as unknown as DynamoDBClientResolvedConfig,
    send: mockSendFunction as DynamoDBDocumentClient["send"],
  };
  return partialCLient as DynamoDBDocumentClient;
}
