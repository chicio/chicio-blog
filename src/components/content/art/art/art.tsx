import { ContentPage } from "@/components/features/content/content-page";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import ArtContent from "@/content/art/content.mdx";
import { ArtHeader } from "../art-header";

/**
 * The gallery is MDX-generated (`@microflash/rehype-figure` wraps images in `figure`/`figcaption`,
 * `LightboxImage` renders the `button`/`img`), so the styling below targets those descendants directly
 * instead of via a global content stylesheet.
 */
const artGalleryGridClass = [
    "w-full mx-0 my-8 px-4 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4",
    "[&_figure]:m-0 [&_figure]:flex [&_figure]:h-full [&_figure]:flex-col [&_figure]:items-center [&_figure]:justify-between",
    "[&_figure_button]:block [&_figure_button]:w-full",
    "[&_figure_img]:h-48 [&_figure_img]:w-full [&_figure_img]:rounded-xl [&_figure_img]:border [&_figure_img]:border-solid [&_figure_img]:border-accent-alpha-40 [&_figure_img]:object-cover [&_figure_img]:shadow-lg [&_figure_img]:transition-all [&_figure_img]:duration-500 [&_figure_img:hover]:scale-102",
    "[&_figure_figcaption]:mt-2 [&_figure_figcaption]:mb-0 [&_figure_figcaption]:text-sm",
].join(" ");

export const Art = () => {
    return (
        <ContentPage
            author={siteMetadata.author}
            trackingCategory={tracking.category.art}
        >
            <ArtHeader />
            <div className={artGalleryGridClass}>
                <ArtContent />
            </div>
        </ContentPage>
    );
};
