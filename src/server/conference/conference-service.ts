import { randomUUID } from "crypto";
import { ConferenceStore } from "./conference-store";
import { ConferenceWriteService } from "./conference-write-service";
import { ConferenceReadService } from "./conference-read-service";
import {
  ConferenceCreationRequest,
  ConferenceDetails,
  ConferenceUpdateRequest,
} from "./conference";
import { ConferenceId } from "./conference-id";
export class ConferenceService
  implements ConferenceWriteService, ConferenceReadService
{
  constructor(private readonly store: ConferenceStore) {}
  async addConference(
    request: ConferenceCreationRequest,
  ): Promise<ConferenceId> {
    const conferenceId = ConferenceId.parse(randomUUID());
    await this.store.storeConference({
      conferenceId,
      location: {
        building: request.location.building,
        street: request.location.street,
        suburb: request.location.suburb,
      },
      name: request.name,
    });
    return conferenceId;
  }
  async getAllConferences(): Promise<ConferenceDetails[]> {
    const conferences = await this.store.getAllConferences();
    return conferences;
  }
  async getConference(conferenceId: ConferenceId): Promise<ConferenceDetails> {
    const conferenceDetails = await this.store.getConference(conferenceId);
    return conferenceDetails;
  }
  async deleteConference(conferenceId: ConferenceId): Promise<void> {
    this.store.deleteConference(conferenceId);
  }
  updateConference(updateFields: ConferenceUpdateRequest): Promise<void> {
    return this.store.updateConference({
      conferenceId: updateFields.conferenceId,
      location: {
        building: updateFields.location.building,
        street: updateFields.location.street,
        suburb: updateFields.location.suburb,
      },
      name: updateFields.name,
    });
  }
}
