import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogComments } from "./index";

vi.mock("@giscus/react", () => ({
    default: (props: Record<string, unknown>) => <div data-testid="giscus" data-props={JSON.stringify(props)} />,
}));

describe("BlogComments", () => {
    describe("render", () => {
        it("mounts the giscus widget", () => {
            render(<BlogComments />);
            expect(screen.getByTestId("giscus")).toBeInTheDocument();
        });

        it("passes the site's giscus configuration to the widget", () => {
            render(<BlogComments />);
            const props = JSON.parse(screen.getByTestId("giscus").getAttribute("data-props")!);
            expect(props.repo).toBe("chicio/chicio-blog");
            expect(props.mapping).toBe("pathname");
            expect(props.theme).toBe("https://www.fabrizioduroni.it/giscus-matrix.css");
        });
    });
});
