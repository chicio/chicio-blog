import { CookieConsentBanner } from "chicio-blog";

// The banner is position:fixed and anchored to the bottom of its containing block,
// so each cell supplies a full-card-height root for it to sit in. Passing
// decided={true} renders nothing at all, so there is no "dismissed" cell.
const cardHeight = { height: "calc(100vh - 48px)" };

const acceptCookies = () => {};
const rejectCookies = () => {};

export const Default = () => (
    <div className="relative" style={cardHeight}>
        <CookieConsentBanner decided={false} onAccept={acceptCookies} onReject={rejectCookies} />
    </div>
);

// Over real page content: the glassmorphism panel blurs whatever it covers, which
// is the whole point of the variant the banner asks for.
export const OverPageContent = () => (
    <div className="relative flex flex-col gap-4 py-8" style={cardHeight}>
        <div className="container-fixed flex flex-col gap-4">
            <h1 className="text-2xl text-accent">Blog</h1>
            <h2 className="text-xl text-primary-text">
                Building an MCP server for my Next.js blog: how I gave AI assistants direct access to my content
            </h2>
            <p className="text-primary-text leading-relaxed">
                How I built a Model Context Protocol server on top of my Next.js blog, covering the MCP protocol
                architecture, JSON-RPC transport, capability negotiation, Streamable HTTP, OAuth discovery, and a full
                TypeScript implementation deployed on Vercel.
            </p>
            <p className="text-primary-text leading-relaxed">
                The Model Context Protocol is an open standard that lets an AI assistant discover and call the tools a
                server exposes, so the assistant can read my posts, my DSA exercises and my videogame collection
                without scraping a single HTML page.
            </p>
        </div>
        <CookieConsentBanner decided={false} onAccept={acceptCookies} onReject={rejectCookies} />
    </div>
);
