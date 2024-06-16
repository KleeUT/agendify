export const PARTITION_KEY_PREFIX = "CONF#";

export function partitionKeyFor(conferenceId: string): string {
  return `${PARTITION_KEY_PREFIX}${conferenceId}`;
}
