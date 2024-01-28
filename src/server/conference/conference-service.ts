import { ConferenceWriteService } from "../../../types/domain/conference-write-service";
import {
  ConferenceCreationRequest,
  ConferenceDetails,
} from "../../../types/domain/conference";
import { DynamoConferenceStore } from "../dynamo/dynamo-conference-store";
import { randomUUID } from "crypto";
import { ConferenceReadService } from "../../../types/domain/conference-read-service";
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
    const ConferenceDetails = await this.store.getConference(conferenceId);
    return ConferenceDetails;
  }
}
