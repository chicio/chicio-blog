import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CookieConsentBanner } from "./cookie-consent-banner";

vi.mock("framer-motion", () => ({
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
    motion: {
        div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
            <div {...props}>{children}</div>
        ),
    },
}));

describe("CookieConsentBanner", () => {
    describe("render", () => {
        it("renders the consent dialog when not yet decided", () => {
            render(<CookieConsentBanner decided={false} onAccept={vi.fn()} onReject={vi.fn()} />);
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        it("renders the accept button", () => {
            render(<CookieConsentBanner decided={false} onAccept={vi.fn()} onReject={vi.fn()} />);
            expect(screen.getByText(/Wake up/)).toBeInTheDocument();
        });

        it("renders the reject button", () => {
            render(<CookieConsentBanner decided={false} onAccept={vi.fn()} onReject={vi.fn()} />);
            expect(screen.getByText(/Sleep/)).toBeInTheDocument();
        });

        it("renders nothing when already decided", () => {
            const { container } = render(
                <CookieConsentBanner decided={true} onAccept={vi.fn()} onReject={vi.fn()} />,
            );
            expect(container.querySelector("[role='dialog']")).toBeNull();
        });
    });

    describe("interaction", () => {
        it("calls onAccept when the accept button is clicked", async () => {
            const onAccept = vi.fn();
            render(<CookieConsentBanner decided={false} onAccept={onAccept} onReject={vi.fn()} />);
            await userEvent.click(screen.getByText(/Wake up/));
            expect(onAccept).toHaveBeenCalledOnce();
        });

        it("calls onReject when the reject button is clicked", async () => {
            const onReject = vi.fn();
            render(<CookieConsentBanner decided={false} onAccept={vi.fn()} onReject={onReject} />);
            await userEvent.click(screen.getByText(/Sleep/));
            expect(onReject).toHaveBeenCalledOnce();
        });
    });
});
