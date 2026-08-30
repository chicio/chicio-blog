import type { Meta, StoryObj } from "@storybook/react-vite";
import { LightboxImage } from ".";
import { landscapeImage, portraitImage } from "../../stories/sample-media";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Lightbox Image",
    component: LightboxImage,
};

export default meta;

type Story = StoryObj;

// LightboxImage takes the full <img> prop surface (ComponentPropsWithoutRef<"img">)
// and renders the image inside a zoom-in button that dispatches the lightbox-open
// event. It stretches to its container, so every cell constrains the container.
// The srcs here are the real featured images of two published posts, inlined at
// build time because the preview card has no network.
const DefaultStory = () => (
    <div className="flex max-w-2xl">
        <LightboxImage
            src={landscapeImage}
            alt="Chrome Built-in AI: adding on-device summarization to my blog with the Summarizer API"
            className="w-full rounded-xl"
        />
    </div>
);

// How it appears in a post: prose, the click-to-zoom image, then prose again.
const InArticleStory = () => (
    <div className="container-fixed flex flex-col gap-4">
        <p className="text-primary-text leading-relaxed">
            How I integrated Chrome&apos;s Built-in AI Summarizer API to add TL;DR and Key Points features to my blog
            posts, with progressive enhancement, streaming responses, and on-device privacy.
        </p>
        <LightboxImage
            src={landscapeImage}
            alt="The Summarizer API running on-device inside a blog post"
            className="w-full rounded-xl"
        />
        <p className="text-primary-text leading-relaxed">
            Every image in an article is wrapped in this component, so any of them can be opened full screen without
            leaving the page.
        </p>
    </div>
);

// The art gallery: every drawing on /art is a LightboxImage, so the page reads as
// a grid of thumbnails that each open full screen.
const ArtGalleryStory = () => (
    <div className="flex flex-wrap gap-4">
        <div className="flex w-80">
            <LightboxImage src={portraitImage} alt="Jellyfish 🪼" className="w-full rounded-xl" />
        </div>
        <div className="flex w-80">
            <LightboxImage
                src={portraitImage}
                alt="Bowser from Super Mario Wonder 🧑‍🔧😈👾"
                className="w-full rounded-xl"
            />
        </div>
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const InArticle: Story = { render: () => <InArticleStory /> };
export const ArtGallery: Story = { render: () => <ArtGalleryStory /> };
