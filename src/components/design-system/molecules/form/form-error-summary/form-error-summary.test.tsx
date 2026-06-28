import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormErrorSummary } from "./form-error-summary";

describe("FormErrorSummary", () => {
    describe("render", () => {
        it("renders nothing when show is false", () => {
            const { container } = render(
                <FormErrorSummary show={false} errorName="Error" errorsList={{ field: "Required" }} />,
            );
            expect(container.firstChild).toBeNull();
        });

        it("renders the error name when show is true", () => {
            render(<FormErrorSummary show={true} errorName="Form Error" />);
            expect(screen.getByText("Form Error")).toBeInTheDocument();
        });

        it("renders error messages from errorsList when show is true", () => {
            render(
                <FormErrorSummary
                    show={true}
                    errorName="Validation failed"
                    errorsList={{ name: "Name is required", email: "Email is invalid" }}
                />,
            );
            expect(screen.getByText("Name is required")).toBeInTheDocument();
            expect(screen.getByText("Email is invalid")).toBeInTheDocument();
        });

        it("renders no list when errorsList is not provided", () => {
            render(<FormErrorSummary show={true} errorName="Error" />);
            expect(screen.queryByRole("list")).not.toBeInTheDocument();
        });
    });
});
