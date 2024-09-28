import { ConferenceId } from "./conference-id";
import { ConferenceStore } from "./conference-store";

export class ConferenceValidator {
  constructor(private readonly store: ConferenceStore) {}
  async conferenceExists(conferenceId: ConferenceId): Promise<boolean> {
    const confMaybe = await this.store.getConference(conferenceId);
    return confMaybe.hasValue();
  }
}
