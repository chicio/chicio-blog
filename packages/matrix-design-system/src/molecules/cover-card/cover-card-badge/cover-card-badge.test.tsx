import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CoverCardBadge } from "./cover-card-badge";

describe("CoverCardBadge", () => {
    describe("render", () => {
        it("renders its children", () => {
            render(<CoverCardBadge>23/23</CoverCardBadge>);
            expect(screen.getByText("23/23")).toBeInTheDocument();
        });
    });
});
