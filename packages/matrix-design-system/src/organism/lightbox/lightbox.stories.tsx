import type { Meta, StoryObj } from "@storybook/react-vite";
import { Lightbox } from ".";
import { openLightbox } from "../../state/lightbox/lightbox-events";
import { landscapeImage, portraitImage } from "../../stories/sample-media";
import { useEffect } from "react";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Organism/Lightbox",
    component: Lightbox,
};

export default meta;

type Story = StoryObj;

// package-capture screenshots with the page clock frozen (playwright
// clock.setFixedTime), so framer-motion's enter transitions never advance and the
// overlay stays at its initial opacity: 0 — the card came back empty. This pins
// anything still sitting at the initial frame to its settled value. It is a
// capture-harness workaround, not a style decision: nothing else is touched
// because only un-advanced elements carry an inline `opacity: 0;`.
const settledEnterAnimations = `
.ds-motion-settled [style*="opacity: 0;"] {
    opacity: 1 !important;
    transform: none !important;
}
`;

// Lightbox is propless and renders null until the `lightbox-open` event carrying a
// src/alt pair reaches it — that is how LightboxImage drives it from anywhere in
// the page. The opener is rendered AFTER <Lightbox /> so the lightbox's own
// listener effect is registered before the event is dispatched.
const LightboxOpener = ({ src, alt }: { src: string; alt: string }) => {
    useEffect(() => {
        openLightbox({ src, alt });
    }, [src, alt]);

    return null;
};

// The overlay is position:fixed, so the cell root gives it a full-card containing
// block to fill; without one the backdrop collapses to zero height.
const cardHeight = { height: "calc(100vh - 48px)" };

const OpenStory = () => (
    <div className="ds-motion-settled relative" style={cardHeight}>
        <style>{settledEnterAnimations}</style>
        <Lightbox />
        <LightboxOpener
            src={landscapeImage}
            alt="Chrome Built-in AI: adding on-device summarization to my blog with the Summarizer API"
        />
    </div>
);

// A square source instead of a wide one: the image is capped at 90vh/90vw and
// object-contain keeps it whole, so the overlay reframes around it.
const ArtworkStory = () => (
    <div className="ds-motion-settled relative" style={cardHeight}>
        <style>{settledEnterAnimations}</style>
        <Lightbox />
        <LightboxOpener src={portraitImage} alt="Bowser from Super Mario Wonder 🧑‍🔧😈👾" />
    </div>
);

export const Open: Story = { render: () => <OpenStory /> };
export const Artwork: Story = { render: () => <ArtworkStory /> };
