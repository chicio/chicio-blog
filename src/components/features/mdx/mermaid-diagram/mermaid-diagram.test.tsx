import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test-utils";
import { MermaidDiagram } from "./mermaid-diagram";
import type { Mermaid } from "mermaid";

const mockLoadMermaid = vi.hoisted(() => vi.fn<() => Promise<Mermaid>>());

vi.mock("./mermaid-loader", () => ({
    loadMermaid: mockLoadMermaid,
    nextMermaidId: () => "mermaid-1",
}));

describe("MermaidDiagram", () => {
    beforeEach(() => {
        mockLoadMermaid.mockReset();
    });

    describe("loading state", () => {
        it("shows a loading indicator before mermaid resolves", () => {
            mockLoadMermaid.mockReturnValue(new Promise(() => {}));
            render(<MermaidDiagram definition="graph TD; A-->B" />);
            expect(screen.getByText("Rendering diagram...")).toBeInTheDocument();
        });
    });

    describe("error state", () => {
        it("shows an error message when mermaid rejects", async () => {
            mockLoadMermaid.mockRejectedValue(new Error("fail"));
            render(<MermaidDiagram definition="invalid" />);
            expect(await screen.findByText("Failed to render diagram")).toBeInTheDocument();
        });
    });

    describe("rendered state", () => {
        it("does not show the loading indicator after mermaid resolves", async () => {
            const mockRender = vi.fn().mockResolvedValue({ svg: "<svg></svg>" });
            mockLoadMermaid.mockResolvedValue({ render: mockRender } as unknown as Mermaid);
            render(<MermaidDiagram definition="graph TD; A-->B" />);
            await vi.waitFor(() => {
                expect(screen.queryByText("Rendering diagram...")).toBeNull();
            });
        });
    });

    describe("container aria", () => {
        it("has an aria-label on the diagram container", () => {
            mockLoadMermaid.mockReturnValue(new Promise(() => {}));
            render(<MermaidDiagram definition="graph TD; A-->B" />);
            expect(screen.getByLabelText("Mermaid diagram")).toBeInTheDocument();
        });
    });
});
