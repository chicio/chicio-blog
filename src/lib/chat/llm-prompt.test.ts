import { describe, it, expect } from "vitest";
import { createSystemPrompt } from "./llm-prompt";

describe("createSystemPrompt", () => {
    describe("structure", () => {
        it("returns a non-empty string", () => {
            const prompt = createSystemPrompt();
            expect(typeof prompt).toBe("string");
            expect(prompt.length).toBeGreaterThan(0);
        });
    });

    describe("professional profile content", () => {
        it("includes Fabrizio's name", () => {
            expect(createSystemPrompt()).toContain("Fabrizio Duroni");
        });

        it("includes his website URL", () => {
            expect(createSystemPrompt()).toContain("fabrizioduroni.it");
        });

        it("includes lastminute.com work experience", () => {
            expect(createSystemPrompt()).toContain("lastminute.com");
        });

        it("includes iOS / mobile development background", () => {
            expect(createSystemPrompt()).toContain("React Native");
        });
    });

    describe("fun facts section", () => {
        it("includes clown easter egg content", () => {
            expect(createSystemPrompt()).toContain("clown");
        });

        it("includes PDD fun fact", () => {
            expect(createSystemPrompt()).toContain("PDD");
        });
    });

    describe("RAG instruction", () => {
        it("references the Fabrizio Duroni Blog Knowledge tool", () => {
            expect(createSystemPrompt()).toContain("Fabrizio Duroni Blog Knowledge");
        });
    });

    describe("idempotency", () => {
        it("returns the same string on repeated calls", () => {
            expect(createSystemPrompt()).toBe(createSystemPrompt());
        });
    });
});
