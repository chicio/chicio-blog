import { ExternalLink } from "chicio-blog";

// ExternalLink is an unstyled anchor: the accent colour and glow come from the base `a` rule in the
// theme. Single instances go in a flex row so the anchor shrinks to its text instead of reading as a
// full-width bar.
export const Default = () => (
    <div className="flex">
        <ExternalLink href="https://github.com/chicio" target="_blank" rel="noopener noreferrer">
            See the source on GitHub
        </ExternalLink>
    </div>
);

export const SocialButtons = () => (
    <div className="flex flex-wrap items-center gap-3">
        <ExternalLink
            className="glow-container inline-flex items-center gap-2 px-4 py-2 no-underline"
            href="https://www.linkedin.com/in/fabrizioduroni/"
            target="_blank"
            rel="noopener noreferrer"
        >
            LinkedIn
        </ExternalLink>
        <ExternalLink
            className="glow-container inline-flex items-center gap-2 px-4 py-2 no-underline"
            href="https://github.com/chicio"
            target="_blank"
            rel="noopener noreferrer"
        >
            GitHub
        </ExternalLink>
        <ExternalLink
            className="glow-container inline-flex items-center gap-2 px-4 py-2 no-underline"
            href="https://www.fabrizioduroni.it"
            target="_blank"
            rel="noopener noreferrer"
        >
            Website
        </ExternalLink>
    </div>
);

export const InlineInProse = () => (
    <p className="text-primary-text max-w-[500px]">
        The whole design system is open source: read the components in the{" "}
        <ExternalLink href="https://github.com/chicio/chicio-blog" target="_blank" rel="noopener noreferrer">
            chicio-blog repository
        </ExternalLink>{" "}
        and the write-up on{" "}
        <ExternalLink href="https://www.fabrizioduroni.it" target="_blank" rel="noopener noreferrer">
            fabrizioduroni.it
        </ExternalLink>
        .
    </p>
);
