import { describe, it, expect } from "vitest";
import { consoleMarkdown, gameMarkdown } from "./videogames-markdown";

describe("videogames-markdown with the real content", () => {
    describe("consoleMarkdown", () => {
        it("gets the own-copy carousel from the body, once, and no ConsoleInformation placeholder", () => {
            const result = consoleMarkdown({ console: "gameboy" })!;

            expect(result.match(/gameboy\/gallery\/1\.jpg/g)).toHaveLength(1);
            expect(result).not.toContain("ImageCarousel");
            expect(result).not.toContain("ConsoleInformation");
            expect(result).not.toContain("[interactive");
        });

        it("lists the facts once, from the frontmatter", () => {
            const result = consoleMarkdown({ console: "gameboy" })!;

            expect(result.match(/\*\*Release Year:\*\*/g)).toHaveLength(1);
            expect(result.match(/\*\*Acquired:\*\*/g)).toHaveLength(1);
            expect(result.match(/\*\*Architecture:\*\*/g)).toHaveLength(1);
            expect(result.match(/\*\*Generation:\*\*/g)).toHaveLength(1);
        });
    });

    describe("gameMarkdown", () => {
        it("gets the own-copy and the gameplay carousels from the body, and no GameInformation placeholder", () => {
            const result = gameMarkdown({ console: "gameboy", game: "batman" })!;

            expect(result.match(/batman\/media\/1\.jpeg/g)).toHaveLength(1);
            expect(result.match(/batman\/gameplay\/1\.jpg/g)).toHaveLength(1);
            expect(result).not.toContain("ImageCarousel");
            expect(result).not.toContain("GameInformation");
            expect(result).not.toContain("[interactive");
        });

        it("lists the facts once, from the frontmatter", () => {
            const result = gameMarkdown({ console: "gameboy", game: "batman" })!;

            expect(result.match(/\*\*Developer:\*\*/g)).toHaveLength(1);
            expect(result.match(/\*\*PEGI Rating:\*\*/g)).toHaveLength(1);
            expect(result.match(/\*\*Acquired:\*\*/g)).toHaveLength(1);
        });
    });
});
