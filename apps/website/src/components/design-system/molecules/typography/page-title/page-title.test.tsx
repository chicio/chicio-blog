import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageTitle } from "./page-title";

describe("PageTitle", () => {
    describe("render", () => {
        it("renders children as an h1 heading", () => {
            render(<PageTitle>My Page Title</PageTitle>);
            expect(screen.getByRole("heading", { level: 1, name: "My Page Title" })).toBeInTheDocument();
        });

        it("renders arbitrary children", () => {
            render(<PageTitle><span>Nested</span></PageTitle>);
            expect(screen.getByText("Nested")).toBeInTheDocument();
        });
    });
});
