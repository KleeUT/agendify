import { ConferenceId } from "../conference/conference-id";

export const PARTITION_KEY_PREFIX = "CONF#";

export function partitionKeyFor(conferenceId: ConferenceId): string {
  return `${PARTITION_KEY_PREFIX}${conferenceId.toString()}`;
}
