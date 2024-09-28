import { describe, expect, it, vi } from "vitest";

import { ConferenceValidator } from "./conference-validator";
import { ConferenceStore } from "./conference-store";
import { ConferenceId } from "./conference-id";
import { Maybe } from "../../utils/maybe";
import { NoItem } from "../../utils/dynamo/no-item";
describe("Conference Validator", () => {
  it("Should validate that a conference exists", async () => {
    const store: ConferenceStore = {
      storeConference: vi.fn(),
      getConference: vi.fn().mockResolvedValue(Maybe.withValue({})),
      getAllConferences: vi.fn(),
      deleteConference: vi.fn(),
      updateConference: vi.fn(),
    } as ConferenceStore;
    const validator = new ConferenceValidator(store);
    const valid = await validator.conferenceExists(ConferenceId.parse("nope"));
    return expect(valid).toBe(true);
  });
  it("Should validate that a conference does not exist", async () => {
    const store: ConferenceStore = {
      storeConference: vi.fn(),
      getConference: vi
        .fn()
        .mockReturnValue(Maybe.withError(new NoItem("", "conference"))),
      getAllConferences: vi.fn(),
      deleteConference: vi.fn(),
      updateConference: vi.fn(),
    } as ConferenceStore;
    const validator = new ConferenceValidator(store);
    const valid = await validator.conferenceExists(ConferenceId.parse("nope"));
    return expect(valid).toBe(false);
  });
});
