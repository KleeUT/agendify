import {
  ConferenceReadService,
  ConferenceWriteService,
  ConferenceCreationRequest,
  ConferenceDetails,
} from "../../../types/domain/conference";

import { randomUUID } from "crypto";
import { ConferenceStore } from "./conference-store";
export class ConferenceService
  implements ConferenceWriteService, ConferenceReadService
{
  constructor(private readonly store: ConferenceStore) {}
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
  async getAllConferences(): Promise<ConferenceDetails[]> {
    const conferences = await this.store.getAllConferences();
    return conferences;
  }
  async getConference(conferenceId: string): Promise<ConferenceDetails> {
    const conferenceDetails = await this.store.getConference(conferenceId);
    return conferenceDetails;
  }
  async deleteConference(conferenceId: string): Promise<void> {
    this.store.deleteConference(conferenceId);
  }
}
