import { Config } from "../config";
import { initialise as initialiseConferenceContext } from "./conference/context";
import { initialiseSpeakerContext } from "./speaker/context";
import { initialiseSessionContext } from "./session/context";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { initialiseAgendaContext } from "./agenda";

export function initialise(config: Config) {
  const dynamoDocumentClient = DynamoDBDocumentClient.from(
    new DynamoDBClient(),
  );
  const conferenceContext = initialiseConferenceContext(
    config,
    dynamoDocumentClient,
  );
  const speakerContext = initialiseSpeakerContext(config, dynamoDocumentClient);
  const sessionContext = initialiseSessionContext(config, dynamoDocumentClient);
  const agendaContext = initialiseAgendaContext(config, dynamoDocumentClient);
  return {
    ...conferenceContext,
    ...speakerContext,
    ...sessionContext,
    ...agendaContext,
  };
}
