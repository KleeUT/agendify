import { describe, expect, it, vi } from "vitest";
import { SessionValidator } from "./session-validator";
import { SessionStore } from "./session-store";
import { Maybe } from "../../utils/maybe";
import { NoItem } from "../../utils/dynamo/no-item";
import { SessionId } from "./session-id";
import { ConferenceId } from "../conference/conference-id";

describe("Session Validtor", () => {
  it("should establish if a session does not exists", async () => {
    const store: SessionStore = {
      addSession: vi.fn(),
      deleteSession: vi.fn(),
      getAllSessions: vi.fn(),
      getSession: vi
        .fn()
        .mockReturnValue(Maybe.withError(new NoItem("no item", "session"))),
    };
    const sessionValidator = new SessionValidator(store);
    const exists = await sessionValidator.sessionExists(
      ConferenceId.parse("conferenceId"),
      SessionId.parse("cat"),
    );
    await expect(exists).toBe(false);
  });
  it("should establish if a session exists", async () => {
    const store: SessionStore = {
      addSession: vi.fn(),
      deleteSession: vi.fn(),
      getAllSessions: vi.fn(),
      getSession: vi.fn().mockReturnValue(Maybe.withValue("")),
    };
    const sessionValidator = new SessionValidator(store);
    const exists = await sessionValidator.sessionExists(
      ConferenceId.parse("conferenceId"),
      SessionId.parse("cat"),
    );
    await expect(exists).toBe(false);
  });
});
