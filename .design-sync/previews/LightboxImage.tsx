import { LightboxImage } from "chicio-blog";
import summarizerFeaturedImage from "../../src/content/blog/post/2026/04/05/chrome-built-in-ai-summarizer/media/chrome-built-in-ai-summarizer.jpg";
import jellyfishDrawing from "../../src/content/art/media/2023-04-18.jpg";
import bowserDrawing from "../../src/content/art/media/2024-02-07.jpg";

// LightboxImage takes the full <img> prop surface (ComponentPropsWithoutRef<"img">)
// and renders the image inside a zoom-in button that dispatches the lightbox-open
// event. It stretches to its container, so every cell constrains the container.
// The srcs here are the real featured images of two published posts, inlined at
// build time because the preview card has no network.
export const Default = () => (
    <div className="flex max-w-2xl">
        <LightboxImage
            src={summarizerFeaturedImage}
            alt="Chrome Built-in AI: adding on-device summarization to my blog with the Summarizer API"
            className="w-full rounded-xl"
        />
    </div>
);

// How it appears in a post: prose, the click-to-zoom image, then prose again.
export const InArticle = () => (
    <div className="container-fixed flex flex-col gap-4">
        <p className="text-primary-text leading-relaxed">
            How I integrated Chrome&apos;s Built-in AI Summarizer API to add TL;DR and Key Points features to my blog
            posts, with progressive enhancement, streaming responses, and on-device privacy.
        </p>
        <LightboxImage
            src={summarizerFeaturedImage}
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
export const ArtGallery = () => (
    <div className="flex flex-wrap gap-4">
        <div className="flex w-80">
            <LightboxImage src={jellyfishDrawing} alt="Jellyfish 🪼" className="w-full rounded-xl" />
        </div>
        <div className="flex w-80">
            <LightboxImage
                src={bowserDrawing}
                alt="Bowser from Super Mario Wonder 🧑‍🔧😈👾"
                className="w-full rounded-xl"
            />
        </div>
    </div>
);
