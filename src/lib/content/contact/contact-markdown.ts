import { markdownDocument } from "@/lib/mdx/markdown-document";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

/**
 * Contact has no `content.mdx` (config exception): its content is entirely driven by
 * `siteMetadata.contacts`, the same config the contact form/footer/SEO already use, so a
 * dedicated MDX file would just duplicate it. This builds the email + every social link
 * straight from that config through the shared `markdownDocument` header.
 */
export const contactMarkdown = (): string => {
    const { email, links } = siteMetadata.contacts;

    const body = `Get in touch directly by email, or find me on any of these platforms.

## Email

${email}

## Social

- [Twitter/X](${links.twitter})
- [Facebook](${links.facebook})
- [LinkedIn](${links.linkedin})
- [GitHub](${links.github})
- [Medium](${links.medium})
- [Dev.to](${links.devto})
- [Instagram](${links.instagram})
`;

    return markdownDocument({
        title: "Contact",
        description: "Send Fabrizio Duroni a message, or reach out on any of his social platforms.",
        slug: slugs.contact,
        body,
    });
};
