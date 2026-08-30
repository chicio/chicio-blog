import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormField } from "./form-field";

describe("FormField", () => {
    describe("render", () => {
        it("renders the label text", () => {
            render(
                <FormField
                    id="name"
                    label="Full Name"
                    icon={<span>icon</span>}
                    type="text"
                />,
            );
            expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
        });

        it("renders the icon", () => {
            render(
                <FormField
                    id="email"
                    label="Email"
                    icon={<span data-testid="field-icon">@</span>}
                    type="email"
                />,
            );
            expect(screen.getByTestId("field-icon")).toBeInTheDocument();
        });

        it("renders an input with the passed props", () => {
            render(
                <FormField
                    id="phone"
                    label="Phone"
                    icon={<span>icon</span>}
                    type="tel"
                    placeholder="555-1234"
                />,
            );
            expect(screen.getByPlaceholderText("555-1234")).toBeInTheDocument();
        });
    });

    describe("props", () => {
        it("applies error border class when hasError is true", () => {
            render(
                <FormField
                    id="name"
                    label="Name"
                    icon={<span>icon</span>}
                    hasError={true}
                />,
            );
            const input = screen.getByLabelText(/Name/);
            expect(input).toHaveClass("border-red-500");
        });

        it("does not apply error border class by default", () => {
            render(
                <FormField
                    id="name"
                    label="Name"
                    icon={<span>icon</span>}
                />,
            );
            const input = screen.getByLabelText(/Name/);
            expect(input).not.toHaveClass("border-red-500");
        });
    });
});
