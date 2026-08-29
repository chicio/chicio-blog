import { describe, it, expect, vi } from "vitest";
import { render, screen, motionDivMock } from "@/test-utils";
import { AboutMeTableOfContents } from "./index";

vi.mock("matrix-design-system", async (importOriginal) => ({
    ...(await importOriginal<typeof import("matrix-design-system")>()),
    ...motionDivMock(),
}));

describe("AboutMeTableOfContents", () => {
    describe("render", () => {
        it("renders the author name", () => {
            render(<AboutMeTableOfContents />);
            expect(screen.getByText("Fabrizio Duroni")).toBeInTheDocument();
        });

        it("renders the software engineer title", () => {
            render(<AboutMeTableOfContents />);
            expect(screen.getByText("Software Engineer")).toBeInTheDocument();
        });

        it("renders navigation buttons for all sections", () => {
            render(<AboutMeTableOfContents />);
            expect(screen.getByRole("button", { name: /jump to biography section/i })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /jump to technologies section/i })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /jump to experience section/i })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /jump to open source section/i })).toBeInTheDocument();
        });
    });
});
