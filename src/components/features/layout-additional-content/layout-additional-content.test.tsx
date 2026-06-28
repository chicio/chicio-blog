import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test-utils";
import { fireEvent } from "@testing-library/react";

const mockWriteConsent = vi.hoisted(() => vi.fn());

vi.mock("@/lib/consents/consents", () => ({
    hasConsented: vi.fn().mockReturnValue(false),
    writeConsent: mockWriteConsent,
    consentChangeEvent: "consent-change",
}));

vi.mock("@/components/features/consent/use-has-consent-decision", () => ({
    useHasConsentDecision: vi.fn().mockReturnValue(false),
}));

vi.mock("@/lib/background-sync/contact-queue", () => ({
    contactQueue: { isEmpty: () => true, dequeue: () => null },
}));

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));
vi.mock("@/lib/content/search-filename", () => ({ searchIndexFileName: "search.json" }));
vi.mock("@/components/features/easter-eggs/white-rabbit", () => ({
    whiteRabbitEasterEgg: vi.fn().mockReturnValue(null),
}));

vi.mock("./use-layout-additional-content-store", () => ({
    useLayoutAdditionalContentStore: () => ({
        state: { consented: false, decided: false },
        effects: {
            acceptConsent: () => mockWriteConsent("accepted"),
            rejectConsent: () => mockWriteConsent("rejected"),
            trackCommandPaletteOpen: vi.fn(),
            trackCommandPaletteOpenChat: vi.fn(),
            trackCommandPaletteSearchResultSelect: vi.fn(),
            trackCommandPaletteToggleMotion: vi.fn(),
            trackCommandPaletteCustomizeMatrixRain: vi.fn(),
        },
    }),
}));

const MOCK_MODULES: Record<string, React.ComponentType<Record<string, unknown>>> = {};

vi.mock("next/dynamic", () => ({
    default: (loader: () => Promise<{ [key: string]: React.ComponentType }>) => {
        let key = "";
        const loaderString = loader.toString();
        if (loaderString.includes("cookie-consent-banner")) {
            key = "cookie-consent-banner";
        } else {
            return () => null;
        }
        const getComp = () => MOCK_MODULES[key];
        return (props: Record<string, unknown>) => {
            const C = getComp();
            return C ? <C {...props} /> : null;
        };
    },
}));

MOCK_MODULES["cookie-consent-banner"] = (props: Record<string, unknown>) => {
    const decided = props.decided as boolean;
    const onAccept = props.onAccept as () => void;
    const onReject = props.onReject as () => void;
    return (
        <div data-testid="cookie-consent-banner" data-decided={String(decided)}>
            <button onClick={onAccept}>Accept</button>
            <button onClick={onReject}>Reject</button>
        </div>
    );
};

import { LayoutAdditionalContent } from "./layout-additional-content";

describe("LayoutAdditionalContent", () => {
    describe("render", () => {
        it("renders the cookie consent banner", () => {
            render(<LayoutAdditionalContent />);
            expect(screen.getByTestId("cookie-consent-banner")).toBeInTheDocument();
        });

        it("passes decided=false when no consent decision has been made", () => {
            render(<LayoutAdditionalContent />);
            expect(screen.getByTestId("cookie-consent-banner")).toHaveAttribute(
                "data-decided",
                "false",
            );
        });

        it("calls writeConsent with accepted when Accept is clicked", () => {
            render(<LayoutAdditionalContent />);
            fireEvent.click(screen.getByRole("button", { name: "Accept" }));
            expect(mockWriteConsent).toHaveBeenCalledWith("accepted");
        });

        it("calls writeConsent with rejected when Reject is clicked", () => {
            render(<LayoutAdditionalContent />);
            fireEvent.click(screen.getByRole("button", { name: "Reject" }));
            expect(mockWriteConsent).toHaveBeenCalledWith("rejected");
        });
    });
});
