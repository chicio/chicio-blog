import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "./label";

describe("Label", () => {
    describe("render", () => {
        it("renders the label text", () => {
            render(<Label value="Email address" />);
            expect(screen.getByText("Email address")).toBeInTheDocument();
        });

        it("renders a label element", () => {
            render(<Label value="Name" id="name-input" />);
            const label = screen.getByText("Name").closest("label");
            expect(label).toBeInTheDocument();
        });

        it("sets htmlFor matching the provided id", () => {
            render(<Label value="Email" id="email-field" />);
            const label = screen.getByText("Email").closest("label");
            expect(label).toHaveAttribute("for", "email-field");
        });

        it("renders an icon alongside the label text when provided", () => {
            render(<Label value="Message" icon={<span data-testid="label-icon">*</span>} />);
            expect(screen.getByTestId("label-icon")).toBeInTheDocument();
            expect(screen.getByText("Message")).toBeInTheDocument();
        });
    });
});
