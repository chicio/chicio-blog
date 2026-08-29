import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArchivedComments } from "./index";

describe("ArchivedComments", () => {
    describe("slug with archived comments", () => {
        it("renders the archived comments heading", () => {
            render(<ArchivedComments slug="dynamic-imports-webpack-chunks" />);
            expect(screen.getByRole("heading", { name: /archived comments/i })).toBeInTheDocument();
        });

        it("renders the comment author and body", () => {
            render(<ArchivedComments slug="dynamic-imports-webpack-chunks" />);
            expect(screen.getByText("Iftikhar Ali")).toBeInTheDocument();
            expect(screen.getByText(/webpack dynamic import/i)).toBeInTheDocument();
        });

        it("renders a formatted original comment date", () => {
            render(<ArchivedComments slug="dynamic-imports-webpack-chunks" />);
            expect(screen.getByText("Nov 29, 2021")).toBeInTheDocument();
        });

        it("renders nested replies indented under their parent comment", () => {
            render(<ArchivedComments slug="dynamic-imports-webpack-chunks" />);
            expect(screen.getByText("Fabrizio")).toBeInTheDocument();
            expect(screen.getByText(/web pack dynamic imports are still relevant/i)).toBeInTheDocument();
        });
    });

    describe("slug without archived comments", () => {
        it("renders nothing", () => {
            const { container } = render(<ArchivedComments slug="a-slug-with-no-archived-comments" />);
            expect(container).toBeEmptyDOMElement();
        });
    });
});
