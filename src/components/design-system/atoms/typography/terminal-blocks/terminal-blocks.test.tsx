import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
    TerminalLine,
    TerminalQuoteLine,
    Cursor,
    ErrorText,
    SuccessText,
    QuoteText,
} from "./terminal-blocks";

describe("TerminalLine", () => {
    describe("render", () => {
        it("renders children", () => {
            render(<TerminalLine>$ echo hello</TerminalLine>);
            expect(screen.getByText("$ echo hello")).toBeInTheDocument();
        });

        it("applies text-accent and font-mono classes", () => {
            const { container } = render(<TerminalLine>cmd</TerminalLine>);
            const el = container.firstChild as HTMLElement;
            expect(el.className).toContain("font-mono");
            expect(el.className).toContain("text-accent");
        });
    });

    describe("size", () => {
        /**
         * Asserted against the exact class list rather than with `toContain`, because the size classes
         * are substrings of one another: "sm:text-sm" contains "text-sm", so a substring match cannot
         * tell the small size from the medium one.
         */
        const fontSizeClassesOf = (el: HTMLElement) =>
            el.className.split(" ").filter((token) => /^(sm:)?text-(xs|sm|base|lg|xl)$/.test(token));

        it("renders at the small size by default", () => {
            const { container } = render(<TerminalLine>cmd</TerminalLine>);
            expect(fontSizeClassesOf(container.firstChild as HTMLElement)).toEqual(["text-xs", "sm:text-sm"]);
        });

        it("renders at the medium size when asked, replacing the small classes rather than adding to them", () => {
            const { container } = render(<TerminalLine size="md">cmd</TerminalLine>);
            expect(fontSizeClassesOf(container.firstChild as HTMLElement)).toEqual(["text-sm", "sm:text-base"]);
        });

        it("renders at the large size when asked, replacing the small classes rather than adding to them", () => {
            const { container } = render(<TerminalLine size="lg">cmd</TerminalLine>);
            expect(fontSizeClassesOf(container.firstChild as HTMLElement)).toEqual(["text-base", "sm:text-lg"]);
        });
    });
});

describe("TerminalQuoteLine", () => {
    describe("render", () => {
        it("renders children", () => {
            render(<TerminalQuoteLine>Quote text</TerminalQuoteLine>);
            expect(screen.getByText("Quote text")).toBeInTheDocument();
        });
    });
});

describe("Cursor", () => {
    describe("render", () => {
        it("renders the blinking underscore character", () => {
            render(<Cursor />);
            expect(screen.getByText("_")).toBeInTheDocument();
        });

        it("applies animate-blink class", () => {
            render(<Cursor />);
            const span = screen.getByText("_");
            expect(span).toHaveClass("animate-blink");
        });
    });
});

describe("ErrorText", () => {
    describe("render", () => {
        it("renders children", () => {
            render(<ErrorText>Error occurred</ErrorText>);
            expect(screen.getByText("Error occurred")).toBeInTheDocument();
        });

        it("applies text-confirm class for error styling", () => {
            render(<ErrorText>Error</ErrorText>);
            expect(screen.getByText("Error")).toHaveClass("text-confirm");
        });
    });
});

describe("SuccessText", () => {
    describe("render", () => {
        it("renders children", () => {
            render(<SuccessText>Success message</SuccessText>);
            expect(screen.getByText("Success message")).toBeInTheDocument();
        });

        it("applies text-accent class", () => {
            render(<SuccessText>Done</SuccessText>);
            expect(screen.getByText("Done")).toHaveClass("text-accent");
        });
    });
});

describe("QuoteText", () => {
    describe("render", () => {
        it("renders children", () => {
            render(<QuoteText>Wisdom</QuoteText>);
            expect(screen.getByText("Wisdom")).toBeInTheDocument();
        });

        it("applies italic and font-mono classes", () => {
            render(<QuoteText>Quote</QuoteText>);
            const span = screen.getByText("Quote");
            expect(span.className).toContain("italic");
            expect(span.className).toContain("font-mono");
        });
    });
});
