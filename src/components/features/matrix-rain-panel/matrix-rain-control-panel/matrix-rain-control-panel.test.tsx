import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test-utils";
import { fireEvent } from "@testing-library/react";
import { MatrixRainControlPanel } from "./matrix-rain-control-panel";

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

vi.mock("@/components/design-system/molecules/controls/control-slider", () => ({
    ControlSlider: ({ label }: { label: string }) => <div data-testid={`slider-${label}`} />,
}));

vi.mock("@/components/design-system/atoms/buttons/switch", () => ({
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
}));

vi.mock("@/components/design-system/atoms/buttons/button", () => ({
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
            expect(screen.queryByText(/Matrix Rain Settings/)).toBeNull();
        });
    });
});
