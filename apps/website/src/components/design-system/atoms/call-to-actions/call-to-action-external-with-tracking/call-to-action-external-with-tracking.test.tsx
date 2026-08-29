import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CallToActionExternalWithTracking } from "./call-to-action-external-with-tracking";

describe("CallToActionExternalWithTracking", () => {
    describe("render", () => {
        it("renders an anchor with the provided href", () => {
            render(<CallToActionExternalWithTracking href="https://example.com">Visit</CallToActionExternalWithTracking>);
            expect(screen.getByRole("link", { name: "Visit" })).toHaveAttribute("href", "https://example.com");
        });

        it("applies the call-to-action class", () => {
            render(<CallToActionExternalWithTracking href="https://example.com">CTA</CallToActionExternalWithTracking>);
            expect(screen.getByRole("link")).toHaveClass("call-to-action");
        });

        it("appends extra className when provided", () => {
            render(
                <CallToActionExternalWithTracking href="https://example.com" className="extra">
                    CTA
                </CallToActionExternalWithTracking>,
            );
            const link = screen.getByRole("link");
            expect(link).toHaveClass("call-to-action");
            expect(link).toHaveClass("extra");
        });

        it("forwards target and rel attributes", () => {
            render(
                <CallToActionExternalWithTracking
                    href="https://example.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Link
                </CallToActionExternalWithTracking>,
            );
            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", "noopener noreferrer");
        });
    });

    describe("interaction", () => {
        it("calls onClick when the link is clicked", async () => {
            const onClick = vi.fn();
            render(
                <CallToActionExternalWithTracking href="https://example.com" onClick={onClick}>
                    CTA
                </CallToActionExternalWithTracking>,
            );
            await userEvent.click(screen.getByRole("link"));
            expect(onClick).toHaveBeenCalledOnce();
        });
    });
});
