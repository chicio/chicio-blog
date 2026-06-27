import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "./accordion";
import { useAccordionStore } from "./use-accordion-store";

vi.mock("@/components/design-system/atoms/animation/motion-div", () => ({
    MotionDiv: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
        <div {...props}>{children}</div>
    ),
}));

describe("Accordion molecule", () => {
    describe("render", () => {
        it("renders the title", () => {
            render(<Accordion title="Section Title">Content here</Accordion>);
            expect(screen.getByText("Section Title")).toBeInTheDocument();
        });

        it("is collapsed by default (defaultOpen = false)", () => {
            render(<Accordion title="Section">Hidden content</Accordion>);
            const trigger = screen.getByRole("button");
            expect(trigger).toHaveAttribute("aria-expanded", "false");
        });

        it("is expanded when defaultOpen = true", () => {
            render(
                <Accordion title="Section" defaultOpen={true}>
                    Visible content
                </Accordion>,
            );
            const trigger = screen.getByRole("button");
            expect(trigger).toHaveAttribute("aria-expanded", "true");
        });

        it("has matching aria-controls and panel id", () => {
            render(<Accordion title="Section">Content</Accordion>);
            const trigger = screen.getByRole("button");
            const panelId = trigger.getAttribute("aria-controls");
            expect(panelId).not.toBeNull();
            const panel = document.getElementById(panelId!);
            expect(panel).not.toBeNull();
        });
    });

    describe("interaction", () => {
        it("expands on click", async () => {
            render(<Accordion title="Section">Content</Accordion>);
            const trigger = screen.getByRole("button");
            expect(trigger).toHaveAttribute("aria-expanded", "false");
            await userEvent.click(trigger);
            expect(trigger).toHaveAttribute("aria-expanded", "true");
        });

        it("collapses on second click", async () => {
            render(<Accordion title="Section" defaultOpen={true}>Content</Accordion>);
            const trigger = screen.getByRole("button");
            await userEvent.click(trigger);
            expect(trigger).toHaveAttribute("aria-expanded", "false");
        });

        it("calls onToggle callback when toggled", async () => {
            const onToggle = vi.fn();
            render(
                <Accordion title="Section" onToggle={onToggle}>
                    Content
                </Accordion>,
            );
            await userEvent.click(screen.getByRole("button"));
            expect(onToggle).toHaveBeenCalledOnce();
        });

        it("applies custom className to the wrapper", () => {
            const { container } = render(
                <Accordion title="Section" className="custom-class">
                    Content
                </Accordion>,
            );
            expect(container.firstChild).toHaveClass("custom-class");
        });
    });
});

describe("useAccordionStore (renderHook)", () => {
    it("starts closed when defaultOpen is false", () => {
        const { result } = renderHook(() => useAccordionStore(false));
        expect(result.current.state.isOpen).toBe(false);
    });

    it("starts open when defaultOpen is true", () => {
        const { result } = renderHook(() => useAccordionStore(true));
        expect(result.current.state.isOpen).toBe(true);
    });

    it("toggle flips open state", () => {
        const { result } = renderHook(() => useAccordionStore(false));
        act(() => {
            result.current.effects.toggle();
        });
        expect(result.current.state.isOpen).toBe(true);
    });

    it("toggle calls the optional onToggle callback", () => {
        const onToggle = vi.fn();
        const { result } = renderHook(() => useAccordionStore(false, onToggle));
        act(() => {
            result.current.effects.toggle();
        });
        expect(onToggle).toHaveBeenCalledOnce();
    });

    it("exposes stable panelId and triggerId", () => {
        const { result } = renderHook(() => useAccordionStore(false));
        const { panelId, triggerId } = result.current.state;
        expect(panelId).toMatch(/accordion-panel-/);
        expect(triggerId).toMatch(/accordion-trigger-/);
    });
});
