import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Footer } from "./footer";
import type { FooterNavHrefs } from "./footer";
import type { SocialContactLinks } from "./footer";

vi.mock("next/link", () => ({
    default: ({
        href,
        children,
        ...rest
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} {...rest}>
            {children}
        </a>
    ),
}));

const navHrefs: FooterNavHrefs = {
    blog: "/blog",
    art: "/art",
    aboutMe: "/about-me",
    archive: "/archive",
    tags: "/tags",
    contact: "/contact",
};

const socialLinks: SocialContactLinks = {
    github: "https://github.com/chicio",
    linkedin: "https://linkedin.com/in/chicio",
    medium: "https://medium.com/@chicio",
    devto: "https://dev.to/chicio",
    twitter: "https://twitter.com/chicio",
    facebook: "https://facebook.com/chicio",
    instagram: "https://instagram.com/chicio",
};

describe("Footer", () => {
    describe("render", () => {
        it("renders the author credit", () => {
            render(<Footer author="Fabrizio Duroni" navHrefs={navHrefs} socialLinks={socialLinks} />);
            expect(screen.getByText(/Fabrizio Duroni/)).toBeInTheDocument();
        });

        it("renders nav links for all sections", () => {
            render(<Footer author="Fabrizio" navHrefs={navHrefs} socialLinks={socialLinks} />);
            expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
            expect(screen.getByRole("link", { name: "About Me" })).toHaveAttribute("href", "/about-me");
            expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
        });

        it("renders social contacts section", () => {
            render(<Footer author="Fabrizio" navHrefs={navHrefs} socialLinks={socialLinks} />);
            expect(screen.getByTitle("Github")).toBeInTheDocument();
            expect(screen.getByTitle("Linkedin")).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onTrackBlog when Blog nav link is clicked", async () => {
            const onTrackBlog = vi.fn();
            render(
                <Footer
                    author="Fabrizio"
                    navHrefs={navHrefs}
                    socialLinks={socialLinks}
                    navTracking={{ onTrackBlog }}
                />,
            );
            await userEvent.click(screen.getByRole("link", { name: "Blog" }));
            expect(onTrackBlog).toHaveBeenCalledOnce();
        });

        it("calls onTrackGithub when github link is clicked", async () => {
            const onTrackGithub = vi.fn();
            render(
                <Footer
                    author="Fabrizio"
                    navHrefs={navHrefs}
                    socialLinks={socialLinks}
                    socialTracking={{ onTrackGithub }}
                />,
            );
            const githubLink = screen.getByTitle("Github").closest("a")!;
            await userEvent.click(githubLink);
            expect(onTrackGithub).toHaveBeenCalledOnce();
        });
    });
});
