import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SocialContacts } from "./social-contacts";

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

const links = {
    github: "https://github.com/chicio",
    linkedin: "https://linkedin.com/in/chicio",
    medium: "https://medium.com/@chicio",
    devto: "https://dev.to/chicio",
    twitter: "https://twitter.com/chicio",
    facebook: "https://facebook.com/chicio",
    instagram: "https://instagram.com/chicio",
};

describe("SocialContacts", () => {
    describe("render", () => {
        it("renders social icon links", () => {
            render(<SocialContacts links={links} contactHref="/contact" />);
            expect(screen.getByTitle("Github")).toBeInTheDocument();
            expect(screen.getByTitle("Linkedin")).toBeInTheDocument();
            expect(screen.getByTitle("Twitter")).toBeInTheDocument();
        });

        it("renders the contact link pointing to contactHref", () => {
            render(<SocialContacts links={links} contactHref="/contact" />);
            const contactLinks = screen.getAllByRole("link");
            const contactLink = contactLinks.find((l) => l.getAttribute("href") === "/contact");
            expect(contactLink).toBeDefined();
        });
    });

    describe("interaction", () => {
        it("calls onTrackGithub when github link is clicked", async () => {
            const onTrackGithub = vi.fn();
            render(<SocialContacts links={links} contactHref="/contact" onTrackGithub={onTrackGithub} />);
            const githubLink = screen.getByTitle("Github").closest("a")!;
            await userEvent.click(githubLink);
            expect(onTrackGithub).toHaveBeenCalledOnce();
        });

        it("calls onTrackLinkedin when linkedin link is clicked", async () => {
            const onTrackLinkedin = vi.fn();
            render(<SocialContacts links={links} contactHref="/contact" onTrackLinkedin={onTrackLinkedin} />);
            const linkedinLink = screen.getByTitle("Linkedin").closest("a")!;
            await userEvent.click(linkedinLink);
            expect(onTrackLinkedin).toHaveBeenCalledOnce();
        });
    });
});
