import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeading } from "./index";

describe("SectionHeading", () => {
    describe("render", () => {
        it("renders the title as a level-2 heading whose accessible name excludes the decorative prompt", () => {
            render(<SectionHeading title="Posts per year" />);

            expect(screen.getByRole("heading", { level: 2, name: "Posts per year" })).toBeInTheDocument();
        });

        it("renders the optional description", () => {
            render(
                <SectionHeading
                    title="Top tags"
                    description="The 10 most used tags across all posts."
                />,
            );

            expect(screen.getByText("The 10 most used tags across all posts.")).toBeInTheDocument();
        });

        it("omits the description paragraph when none is given", () => {
            const { container } = render(<SectionHeading title="Users by device" />);

            expect(container.querySelector("p")).toBeNull();
        });
    });
});
