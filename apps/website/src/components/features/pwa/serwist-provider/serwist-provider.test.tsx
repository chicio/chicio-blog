import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test-utils";
import { SerwistProvider } from "./serwist-provider";

vi.mock("@serwist/next/react", () => ({
    SerwistProvider: ({ children }: React.PropsWithChildren) => (
        <div data-testid="serwist-provider">{children}</div>
    ),
}));

describe("SerwistProvider", () => {
    describe("render", () => {
        it("renders children inside the serwist provider", () => {
            render(
                <SerwistProvider>
                    <span>app content</span>
                </SerwistProvider>,
            );
            expect(screen.getByText("app content")).toBeInTheDocument();
        });

        it("mounts the underlying serwist provider", () => {
            render(
                <SerwistProvider>
                    <span>child</span>
                </SerwistProvider>,
            );
            expect(screen.getByTestId("serwist-provider")).toBeInTheDocument();
        });
    });
});
