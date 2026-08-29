import { describe, it, expect } from "vitest";
import { matchesWhoamiCommand } from "./whoami-command";

describe("matchesWhoamiCommand", () => {
    it("matches the whoami command name", () => {
        expect(matchesWhoamiCommand("whoami")).toBe(true);
    });

    it("does not match a different command", () => {
        expect(matchesWhoamiCommand("pwd")).toBe(false);
    });

    it("is case-sensitive", () => {
        expect(matchesWhoamiCommand("WhoAmI")).toBe(false);
    });

    it("does not match a partial command", () => {
        expect(matchesWhoamiCommand("who")).toBe(false);
    });
});
