import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../../test-utils";
import userEvent from "@testing-library/user-event";
import type { ImageComponent } from "../../../atoms/effects/plain-image";
import type { LinkComponent } from "../../../atoms/links/anchor-link";
import { CoverCard } from "./index";

const { openLightboxMock, inViewMock } = vi.hoisted(() => ({
    openLightboxMock: vi.fn(),
    inViewMock: { value: true },
}));

vi.mock("../../../state/lightbox/lightbox-events", () => ({
    openLightbox: openLightboxMock,
}));

vi.mock("../../../hooks/use-in-view-list", () => ({
    useInViewList: () => [vi.fn(), inViewMock.value],
}));

const deathNoteLink = { kind: "link", href: "/manga/death-note" } as const;

describe("CoverCard", () => {
    beforeEach(() => {
        openLightboxMock.mockClear();
        inViewMock.value = true;
    });

    describe("render", () => {
        it("renders the title as caption and as the cover alt", () => {
            render(<CoverCard src="/cover.jpg" title="Death Note" action={deathNoteLink} />);
            expect(screen.getByText("Death Note")).toBeInTheDocument();
            expect(screen.getByAltText("Death Note")).toHaveAttribute("src", "/cover.jpg");
        });

        it("renders the blurred backdrop as decorative", () => {
            const { container } = render(<CoverCard src="/cover.jpg" title="Death Note" action={deathNoteLink} />);
            const backdrop = container.querySelector("img[aria-hidden='true']");
            expect(backdrop).toHaveAttribute("alt", "");
            expect(backdrop).toHaveClass("blur-lg");
        });

        it("renders the badges slot", () => {
            render(
                <CoverCard src="/cover.jpg" title="Death Note" action={deathNoteLink} badges={<span>23/23</span>} />,
            );
            expect(screen.getByText("23/23")).toBeInTheDocument();
        });

        it("renders no badge container when there are no badges", () => {
            const { container } = render(<CoverCard src="/cover.jpg" title="Death Note" action={deathNoteLink} />);
            expect(container.querySelector(".pointer-events-none")).not.toBeInTheDocument();
        });

        it("renders the injected image component", () => {
            const CustomImage: ImageComponent = ({ alt }) => <span data-testid="custom-image">{alt}</span>;
            render(
                <CoverCard src="/cover.jpg" title="Death Note" action={deathNoteLink} imageComponent={CustomImage} />,
            );
            expect(screen.getAllByTestId("custom-image")).toHaveLength(2);
        });
    });

    describe("lazy rendering", () => {
        it("renders nothing but the frame until the card is in view", () => {
            inViewMock.value = false;
            render(<CoverCard src="/cover.jpg" title="Death Note" action={deathNoteLink} />);
            expect(screen.queryByText("Death Note")).not.toBeInTheDocument();
            expect(screen.queryByRole("link")).not.toBeInTheDocument();
        });
    });

    describe("link action", () => {
        it("links to the href", () => {
            render(<CoverCard src="/cover.jpg" title="Death Note" action={deathNoteLink} />);
            expect(screen.getByRole("link")).toHaveAttribute("href", "/manga/death-note");
        });

        it("calls onClick when the link is clicked", async () => {
            const onClick = vi.fn();
            render(<CoverCard src="/cover.jpg" title="Death Note" action={{ ...deathNoteLink, onClick }} />);
            await userEvent.click(screen.getByRole("link"));
            expect(onClick).toHaveBeenCalledOnce();
        });

        it("renders the link through the injected link component", () => {
            const CustomLink: LinkComponent = ({ href, children }) => (
                <a href={href} data-testid="custom-link">
                    {children}
                </a>
            );
            render(<CoverCard src="/cover.jpg" title="Death Note" action={deathNoteLink} linkComponent={CustomLink} />);
            expect(screen.getByTestId("custom-link")).toHaveAttribute("href", "/manga/death-note");
        });

        it("renders no lightbox button", () => {
            render(<CoverCard src="/cover.jpg" title="Death Note" action={deathNoteLink} />);
            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });
    });

    describe("lightbox action", () => {
        it("opens the lightbox with the cover src and the title as alt", async () => {
            render(<CoverCard src="/art/2026.jpg" title="Jellyfish" action={{ kind: "lightbox" }} />);
            await userEvent.click(screen.getByRole("button", { name: "Open Jellyfish" }));
            expect(openLightboxMock).toHaveBeenCalledWith({ src: "/art/2026.jpg", alt: "Jellyfish" });
        });

        it("renders no link", () => {
            render(<CoverCard src="/art/2026.jpg" title="Jellyfish" action={{ kind: "lightbox" }} />);
            expect(screen.queryByRole("link")).not.toBeInTheDocument();
        });
    });
});
