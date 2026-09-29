import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { CoverCard } from "./cover-card";

vi.mock("next/image", () => ({
    default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} data-next-image="true" />,
}));

vi.mock("next/link", () => ({
    default: ({ href, children }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} data-next-link="true">
            {children}
        </a>
    ),
}));

class IntersectingObserver {
    constructor(private readonly callback: IntersectionObserverCallback) {}
    observe(target: Element) {
        this.callback([{ target, isIntersecting: true } as IntersectionObserverEntry], this as never);
    }
    unobserve() {}
    disconnect() {}
}

describe("CoverCard binding", () => {
    beforeAll(() => {
        vi.stubGlobal("IntersectionObserver", IntersectingObserver);
    });

    it("renders the cover through next/image", () => {
        render(<CoverCard src="/cover.jpg" title="Death Note" action={{ kind: "link", href: "/manga/death-note" }} />);
        expect(screen.getByAltText("Death Note")).toHaveAttribute("data-next-image", "true");
    });

    it("links to the page through next/link", () => {
        render(<CoverCard src="/cover.jpg" title="Death Note" action={{ kind: "link", href: "/manga/death-note" }} />);
        expect(screen.getByRole("link")).toHaveAttribute("data-next-link", "true");
        expect(screen.getByRole("link")).toHaveAttribute("href", "/manga/death-note");
    });

    it("opens the cover in the lightbox when the action asks for it", () => {
        render(<CoverCard src="/cover.jpg" title="Jellyfish" action={{ kind: "lightbox" }} />);
        expect(screen.getByRole("button", { name: "Open Jellyfish" })).toBeInTheDocument();
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
});
