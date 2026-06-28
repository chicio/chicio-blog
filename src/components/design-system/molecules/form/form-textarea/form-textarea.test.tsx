import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormTextarea } from "./form-textarea";

describe("FormTextarea", () => {
    describe("render", () => {
        it("renders the label", () => {
            render(
                <FormTextarea
                    id="message"
                    label="Your Message"
                    icon={<span>icon</span>}
                />,
            );
            expect(screen.getByLabelText(/Your Message/)).toBeInTheDocument();
        });

        it("renders the icon", () => {
            render(
                <FormTextarea
                    id="msg"
                    label="Message"
                    icon={<span data-testid="ta-icon">msg</span>}
                />,
            );
            expect(screen.getByTestId("ta-icon")).toBeInTheDocument();
        });

        it("forwards textarea props", () => {
            render(
                <FormTextarea
                    id="message"
                    label="Message"
                    icon={<span>icon</span>}
                    placeholder="Write here..."
                    rows={5}
                />,
            );
            const textarea = screen.getByPlaceholderText("Write here...");
            expect(textarea).toBeInTheDocument();
        });
    });

    describe("props", () => {
        it("applies error class when hasError is true", () => {
            render(
                <FormTextarea
                    id="message"
                    label="Message"
                    icon={<span>icon</span>}
                    hasError={true}
                />,
            );
            const textarea = screen.getByLabelText(/Message/);
            expect(textarea).toHaveClass("border-red-500");
        });

        it("does not apply error class by default", () => {
            render(
                <FormTextarea
                    id="message"
                    label="Message"
                    icon={<span>icon</span>}
                />,
            );
            const textarea = screen.getByLabelText(/Message/);
            expect(textarea).not.toHaveClass("border-red-500");
        });
    });
});
