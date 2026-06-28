import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@/test-utils";
import { fireEvent, act } from "@testing-library/react";
import { InstallPromptBanner } from "./install-prompt-banner";

beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        })),
    });
});

vi.mock("framer-motion", () => ({
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
    motion: {
        div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
            <div {...props}>{children}</div>
        ),
    },
}));

vi.mock("@/components/design-system/molecules/buttons/pills-buttons", () => ({
    BluePillButton: ({
        children,
        onClick,
        ...props
    }: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) => (
        <button onClick={onClick} {...props}>
            {children}
        </button>
    ),
    RedPillButton: ({
        children,
        onClick,
        ...props
    }: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) => (
        <button onClick={onClick} {...props}>
            {children}
        </button>
    ),
}));

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));
vi.mock("@/lib/pwa/pwa-install-decision", () => ({
    writePwaInstallDecision: vi.fn(),
    readPwaInstallDecision: vi.fn().mockReturnValue(null),
    pwaInstallDecisionChangeEvent: "pwa-install-decision-change",
}));
vi.mock("@/lib/consents/consents", () => ({
    hasConsented: vi.fn().mockReturnValue(true),
    consentChangeEvent: "consent-change",
}));

interface FakeBeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function makeFakePromptEvent(): FakeBeforeInstallPromptEvent {
    return Object.assign(new Event("beforeinstallprompt"), {
        prompt: vi.fn().mockResolvedValue(undefined),
        userChoice: Promise.resolve({ outcome: "accepted" as const }),
        preventDefault: vi.fn(),
    }) as unknown as FakeBeforeInstallPromptEvent;
}

describe("InstallPromptBanner", () => {
    describe("when no install prompt is available", () => {
        it("renders nothing before a beforeinstallprompt event", () => {
            const { container } = render(<InstallPromptBanner />);
            expect(container.firstChild).toBeNull();
        });
    });

    describe("when a beforeinstallprompt event fires and consent is given", () => {
        it("shows the install banner dialog", async () => {
            render(<InstallPromptBanner />);
            await act(async () => {
                window.dispatchEvent(makeFakePromptEvent());
            });
            expect(screen.getByRole("dialog", { name: "Install app banner" })).toBeInTheDocument();
        });

        it("has a dismiss button", async () => {
            render(<InstallPromptBanner />);
            await act(async () => {
                window.dispatchEvent(makeFakePromptEvent());
            });
            expect(screen.getByRole("button", { name: "Dismiss install prompt" })).toBeInTheDocument();
        });

        it("has an install button", async () => {
            render(<InstallPromptBanner />);
            await act(async () => {
                window.dispatchEvent(makeFakePromptEvent());
            });
            expect(screen.getByRole("button", { name: "Install app" })).toBeInTheDocument();
        });

        it("hides the banner after dismiss is clicked", async () => {
            render(<InstallPromptBanner />);
            await act(async () => {
                window.dispatchEvent(makeFakePromptEvent());
            });
            fireEvent.click(screen.getByRole("button", { name: "Dismiss install prompt" }));
            expect(screen.queryByRole("dialog")).toBeNull();
        });
    });
});
