import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthorSocials } from "./author-socials";
import type { Author } from "@/types/content/author";

const base: Author = {
    id: "alessandro_romano",
    name: "Alessandro Romano",
    linkedinUrl: "https://www.linkedin.com/in/alessandroromano92/",
    image: "/media/authors/alessandro-romano.jpg",
    imageLarge: "/media/authors/alessandro-romano-large.jpg",
};

describe("AuthorSocials", () => {
    describe("render", () => {
        it("always renders the LinkedIn link", () => {
            render(<AuthorSocials author={base} />);
            const link = screen.getByRole("link", { name: /linkedin/i });
            expect(link).toHaveAttribute("href", base.linkedinUrl);
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", "noopener noreferrer");
        });

        it("hides GitHub, X and Website when those fields are absent", () => {
            render(<AuthorSocials author={base} />);
            expect(screen.queryByRole("link", { name: /github/i })).not.toBeInTheDocument();
            expect(screen.queryByRole("link", { name: /^x$/i })).not.toBeInTheDocument();
            expect(screen.queryByRole("link", { name: /website/i })).not.toBeInTheDocument();
        });

        it("renders GitHub, X and Website links when present", () => {
            render(
                <AuthorSocials
                    author={{
                        ...base,
                        githubUrl: "https://github.com/aleromano",
                        xUrl: "https://x.com/aleromano",
                        siteUrl: "https://aleromano.dev",
                    }}
                />,
            );
            expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute("href", "https://github.com/aleromano");
            expect(screen.getByRole("link", { name: /^x$/i })).toHaveAttribute("href", "https://x.com/aleromano");
            expect(screen.getByRole("link", { name: /website/i })).toHaveAttribute("href", "https://aleromano.dev");
        });
    });
});
