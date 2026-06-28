import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GenericHeader } from "./generic-header";

describe("GenericHeader", () => {
    const logo = <span data-testid="logo-icon">Icon</span>;

    describe("render", () => {
        it("renders the title", () => {
            render(<GenericHeader title="Chat" subtitle="AI assistant" logo={logo} />);
            expect(screen.getByText("Chat")).toBeInTheDocument();
        });

        it("renders the subtitle", () => {
            render(<GenericHeader title="Chat" subtitle="AI assistant" logo={logo} />);
            expect(screen.getByText("AI assistant")).toBeInTheDocument();
        });

        it("renders the logo", () => {
            render(<GenericHeader title="Chat" subtitle="AI assistant" logo={logo} />);
            expect(screen.getByTestId("logo-icon")).toBeInTheDocument();
        });

        it("renders nothing when visible is false", () => {
            const { container } = render(
                <GenericHeader title="Chat" subtitle="AI assistant" logo={logo} visible={false} />,
            );
            expect(container.firstChild).toBeNull();
        });

        it("renders when visible defaults to true", () => {
            render(<GenericHeader title="Chat" subtitle="AI assistant" logo={logo} />);
            expect(screen.getByText("Chat")).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("responds to click (toggles subtitle via store) without throwing", async () => {
            render(<GenericHeader title="Chat" subtitle="AI assistant" logo={logo} />);
            const header = screen.getByText("Chat").closest("div")!;
            await userEvent.click(header);
            expect(screen.getByText("AI assistant")).toBeInTheDocument();
        });
    });
});
