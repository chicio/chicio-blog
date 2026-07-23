import { describe, it, expect } from "vitest";
import { contactMarkdown } from "./contact-markdown";
import { siteMetadata } from "@/types/configuration/site-metadata";

describe("contactMarkdown", () => {
    it("includes the canonical header with the contact URL", () => {
        const result = contactMarkdown();

        expect(result).toContain("# Contact");
        expect(result).toContain(`**URL:** ${siteMetadata.siteUrl}/contact`);
    });

    it("includes the email address", () => {
        expect(contactMarkdown()).toContain(siteMetadata.contacts.email);
    });

    it("includes every social link", () => {
        const result = contactMarkdown();
        const { links } = siteMetadata.contacts;

        expect(result).toContain(links.twitter);
        expect(result).toContain(links.facebook);
        expect(result).toContain(links.linkedin);
        expect(result).toContain(links.github);
        expect(result).toContain(links.medium);
        expect(result).toContain(links.devto);
        expect(result).toContain(links.instagram);
    });
});
