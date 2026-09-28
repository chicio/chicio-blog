import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InfoPill } from "./info-pill";

describe("InfoPill", () => {
    describe("render", () => {
        it("renders the label followed by a colon and the value", () => {
            render(<InfoPill icon={<span />} label="Publisher" value="Star Comics" />);
            expect(screen.getByText("Publisher:")).toBeInTheDocument();
            expect(screen.getByText("Star Comics")).toBeInTheDocument();
        });

        it("renders the icon slot", () => {
            render(<InfoPill icon={<span data-testid="pill-icon" />} label="Year" value="2026" />);
            expect(screen.getByTestId("pill-icon")).toBeInTheDocument();
        });
    });
});
