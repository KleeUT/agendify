import {
  ConferenceReadService,
  ConferenceWriteService,
  ConferenceCreationRequest,
  ConferenceDetails,
} from "../../../types/domain/conference";

import { DynamoConferenceStore } from "../dynamo";
import { randomUUID } from "crypto";
export class ConferenceService
  implements ConferenceWriteService, ConferenceReadService
{
  constructor(private readonly store: DynamoConferenceStore) {}
  async addConference(request: ConferenceCreationRequest): Promise<string> {
    const id = randomUUID();
    await this.store.storeConference({
      id,
      location: {
        building: request.location.building,
        street: request.location.street,
        suburb: request.location.suburb,
      },
      name: request.name,
    });
    return id;
  }
  async getConference(conferenceId: string): Promise<ConferenceDetails> {
    const conferenceDetails = await this.store.getConference(conferenceId);
    return conferenceDetails;
  }
}
