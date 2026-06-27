import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrackingOptIn } from "./tracking-optin";

vi.mock("@next/third-parties/google", () => ({
    GoogleAnalytics: () => <div data-testid="google-analytics" />,
}));

vi.mock("@vercel/analytics/next", () => ({
    Analytics: () => <div data-testid="vercel-analytics" />,
}));

vi.mock("@vercel/speed-insights/next", () => ({
    SpeedInsights: () => <div data-testid="speed-insights" />,
}));

describe("TrackingOptIn", () => {
    describe("when enabled", () => {
        it("renders tracking providers", () => {
            render(<TrackingOptIn enabled={true} />);
            expect(screen.getByTestId("google-analytics")).toBeInTheDocument();
            expect(screen.getByTestId("vercel-analytics")).toBeInTheDocument();
            expect(screen.getByTestId("speed-insights")).toBeInTheDocument();
        });
    });

    describe("when disabled", () => {
        it("renders nothing", () => {
            const { container } = render(<TrackingOptIn enabled={false} />);
            expect(container.firstChild).toBeNull();
        });
    });
});
