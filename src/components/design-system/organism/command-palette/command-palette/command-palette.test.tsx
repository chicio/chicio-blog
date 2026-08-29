import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommandPalette } from "./command-palette";

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

vi.mock("cmdk", () => ({
    Command: Object.assign(
        ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { shouldFilter?: boolean }) => (
            <div {...props}>{children}</div>
        ),
        {
            Input: ({
                onValueChange,
                placeholder,
                ...rest
            }: React.InputHTMLAttributes<HTMLInputElement> & { onValueChange?: (v: string) => void }) => (
                <input placeholder={placeholder} onChange={(e) => onValueChange?.(e.target.value)} {...rest} />
            ),
            List: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
        },
    ),
}));

const openViaShortcut = () => fireEvent.keyDown(window, { key: "k", ctrlKey: true });

describe("CommandPalette", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("open state", () => {
        it("renders nothing until opened", () => {
            render(<CommandPalette>content</CommandPalette>);
            expect(screen.queryByText("content")).not.toBeInTheDocument();
        });

        it("opens on the keyboard shortcut and renders its children", () => {
            render(<CommandPalette>content</CommandPalette>);
            act(openViaShortcut);
            expect(screen.getByText("content")).toBeInTheDocument();
        });

        it("opens on the command palette open event", () => {
            render(<CommandPalette>content</CommandPalette>);
            act(() => {
                window.dispatchEvent(new Event("command-palette-open"));
            });
            expect(screen.getByText("content")).toBeInTheDocument();
        });

        it("closes on the command palette close event", () => {
            render(<CommandPalette>content</CommandPalette>);
            act(openViaShortcut);
            act(() => {
                window.dispatchEvent(new Event("command-palette-close"));
            });
            expect(screen.queryByText("content")).not.toBeInTheDocument();
        });

        it("closes on escape", () => {
            render(<CommandPalette>content</CommandPalette>);
            act(openViaShortcut);
            act(() => {
                fireEvent.keyDown(window, { key: "Escape" });
            });
            expect(screen.queryByText("content")).not.toBeInTheDocument();
        });

        it("reports every open state change", () => {
            const onOpenChange = vi.fn();
            render(<CommandPalette onOpenChange={onOpenChange}>content</CommandPalette>);
            act(openViaShortcut);
            expect(onOpenChange).toHaveBeenCalledWith(true);
            act(() => {
                fireEvent.keyDown(window, { key: "Escape" });
            });
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });

    describe("query", () => {
        it("reports the trimmed query", async () => {
            const onQueryChange = vi.fn();
            render(<CommandPalette onQueryChange={onQueryChange}>content</CommandPalette>);
            act(openViaShortcut);
            await userEvent.type(screen.getByPlaceholderText("type to search_"), "  hi  ");
            expect(onQueryChange).toHaveBeenLastCalledWith("hi");
        });

        it("uses the provided placeholder", () => {
            render(<CommandPalette placeholder="find_">content</CommandPalette>);
            act(openViaShortcut);
            expect(screen.getByPlaceholderText("find_")).toBeInTheDocument();
        });
    });
});
