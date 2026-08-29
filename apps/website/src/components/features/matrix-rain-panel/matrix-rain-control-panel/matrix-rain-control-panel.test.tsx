import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test-utils";
import { fireEvent, waitFor } from "@testing-library/react";
import { MatrixRainControlPanel } from "./matrix-rain-control-panel";
import { RAIN_STEP_RATE_MAX } from "./use-matrix-rain-control-panel-store";
import { closeEasterEgg, getEasterEggOverlaySlug } from "@/lib/easter-eggs/easter-egg-overlay-state";

vi.mock("framer-motion", () => ({
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
    motion: {
        div: ({
            children,
            initial: _i,
            animate: _a,
            exit: _e,
            transition: _t,
            ...props
        }: React.HTMLAttributes<HTMLDivElement> & {
            initial?: unknown;
            animate?: unknown;
            exit?: unknown;
            transition?: unknown;
        }) => <div {...props}>{children}</div>,
    },
}));

vi.mock("matrix-design-system", async (importOriginal) => ({
    ...(await importOriginal<typeof import("matrix-design-system")>()),
    ControlSlider: ({ label, onChange }: { label: string; onChange: (v: number) => void }) => (
        <input
            data-testid={`slider-${label}`}
            type="range"
            onChange={(e) => onChange(Number(e.target.value))}
        />
    ),
    Switch: ({
        label,
        checked,
        onChange,
    }: {
        label: string;
        checked: boolean;
        onChange: (v: boolean) => void;
    }) => (
        <input
            type="checkbox"
            aria-label={label}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
        />
    ),
    Button: ({
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

const openPanel = () => window.dispatchEvent(new Event("matrix-rain-panel-open"));

describe("MatrixRainControlPanel", () => {
    beforeEach(() => {
        closeEasterEgg();
        localStorage.clear();
    });

    describe("closed by default", () => {
        it("renders nothing before the panel is opened", () => {
            const { container } = render(<MatrixRainControlPanel />);
            expect(container.firstChild).toBeNull();
        });
    });

    describe("when opened via the custom event", () => {
        it("shows the Matrix Rain Settings heading", async () => {
            render(<MatrixRainControlPanel />);
            openPanel();
            expect(await screen.findByText(/Matrix Rain Settings/)).toBeInTheDocument();
        });

        it("shows a close button", async () => {
            render(<MatrixRainControlPanel />);
            openPanel();
            expect(await screen.findByRole("button", { name: "Close panel" })).toBeInTheDocument();
        });

        it("shows the preset buttons", async () => {
            render(<MatrixRainControlPanel />);
            openPanel();
            expect(await screen.findByRole("button", { name: "Classic" })).toBeInTheDocument();
        });
    });

    describe("close behaviour", () => {
        it("closes when the close button is clicked", async () => {
            render(<MatrixRainControlPanel />);
            openPanel();
            const closeButton = await screen.findByRole("button", { name: "Close panel" });
            fireEvent.click(closeButton);
            expect(screen.queryByText(/Matrix Rain Settings/)).toBeNull();
        });

        it("closes on Escape key", async () => {
            render(<MatrixRainControlPanel />);
            openPanel();
            await screen.findByText(/Matrix Rain Settings/);
            fireEvent.keyDown(window, { key: "Escape" });
            await waitFor(() => expect(screen.queryByText(/Matrix Rain Settings/)).toBeNull());
        });
    });

    describe("dodge-this easter egg", () => {
        it("opens the dodge-this egg once the rain speed slider hits its maximum", async () => {
            render(<MatrixRainControlPanel />);
            openPanel();
            const slider = await screen.findByTestId("slider-Speed (Hz)");
            fireEvent.change(slider, { target: { value: String(RAIN_STEP_RATE_MAX) } });
            expect(getEasterEggOverlaySlug()).toBe("dodge-this");
        });

        it("does not open the egg below the maximum", async () => {
            render(<MatrixRainControlPanel />);
            openPanel();
            const slider = await screen.findByTestId("slider-Speed (Hz)");
            fireEvent.change(slider, { target: { value: String(RAIN_STEP_RATE_MAX - 10) } });
            expect(getEasterEggOverlaySlug()).toBeNull();
        });

        it("fires only once per session even after multiple nudges at max", async () => {
            render(<MatrixRainControlPanel />);
            openPanel();
            const slider = await screen.findByTestId("slider-Speed (Hz)");
            fireEvent.change(slider, { target: { value: String(RAIN_STEP_RATE_MAX) } });
            expect(getEasterEggOverlaySlug()).toBe("dodge-this");

            closeEasterEgg();
            fireEvent.change(slider, { target: { value: String(RAIN_STEP_RATE_MAX) } });
            expect(getEasterEggOverlaySlug()).toBeNull();
        });
    });
});
