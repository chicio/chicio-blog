import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormSuccessMessage } from "./form-success-message";

describe("FormSuccessMessage", () => {
    describe("render", () => {
        it("renders the message", () => {
            render(<FormSuccessMessage message="Your message was sent!" />);
            expect(screen.getByText("Your message was sent!")).toBeInTheDocument();
        });
    });
});
