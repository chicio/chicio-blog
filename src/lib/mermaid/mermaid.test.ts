import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { extractMermaidDefinition } from "./mermaid";

const mermaidChild = (definition: string) =>
    createElement("code", { className: "language-mermaid" }, definition);

const nonMermaidChild = (definition: string) =>
    createElement("code", { className: "language-typescript" }, definition);

describe("extractMermaidDefinition", () => {
    describe("valid mermaid code block", () => {
        it("returns the trimmed definition from a language-mermaid code element", () => {
            const result = extractMermaidDefinition(mermaidChild("  graph TD\n  A --> B  "));
            expect(result).toBe("graph TD\n  A --> B");
        });

        it("returns the definition when there is no leading/trailing whitespace", () => {
            const result = extractMermaidDefinition(mermaidChild("graph LR\nA --> B"));
            expect(result).toBe("graph LR\nA --> B");
        });
    });

    describe("non-mermaid code block", () => {
        it("returns null when className does not include language-mermaid", () => {
            const result = extractMermaidDefinition(nonMermaidChild("const x = 1;"));
            expect(result).toBeNull();
        });
    });

    describe("edge cases", () => {
        it("returns null for null children", () => {
            expect(extractMermaidDefinition(null)).toBeNull();
        });

        it("returns null for undefined children", () => {
            expect(extractMermaidDefinition(undefined)).toBeNull();
        });

        it("returns null when children is a plain string (not a React element)", () => {
            expect(extractMermaidDefinition("just a string")).toBeNull();
        });

        it("returns null when child has no className", () => {
            const child = createElement("code", {}, "some content");
            expect(extractMermaidDefinition(child)).toBeNull();
        });

        it("returns null when child's children is not a string", () => {
            const child = createElement("code", { className: "language-mermaid" }, createElement("span", {}, "nested"));
            expect(extractMermaidDefinition(child)).toBeNull();
        });
    });
});
