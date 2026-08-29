import { describe, it, expect, vi } from "vitest";
import { render, screen, nextLinkMock, motionDivMock } from "@/test-utils";
import { ProfilePresentation } from "./index";

vi.mock("next/link", () => nextLinkMock());
vi.mock("@/components/design-system/atoms/animation/motion-div", () => motionDivMock());

describe("ProfilePresentation", () => {
    describe("render", () => {
        it("renders the author name", () => {
            render(<ProfilePresentation author="Fabrizio Duroni" />);
            expect(screen.getByText("Fabrizio Duroni")).toBeInTheDocument();
        });

        it("renders the Software Engineer title", () => {
            render(<ProfilePresentation author="Fabrizio Duroni" />);
            expect(screen.getByText("Software Engineer")).toBeInTheDocument();
        });

        it("renders the author name passed as prop", () => {
            render(<ProfilePresentation author="Test Author" />);
            expect(screen.getByText("Test Author")).toBeInTheDocument();
        });
    });
});
