import type { MetadataRoute } from "next";
import { getAuthorsWithPosts, getPostsTotalPages, getTags } from "@/lib/content/posts/posts";
import { authorIdToSlug, ownerAuthorId } from "@/lib/content/authors/author-slug";
import { contentRegistry } from "@/lib/content/registry";
import { slugFor } from "@/lib/content/slug-template";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

const absoluteUrl = (path: string) => `${siteMetadata.siteUrl}${path === "/" ? "" : path}`;

const defaultImage = [absoluteUrl(siteMetadata.featuredImage)];

/**
 * Everything the content registry knows about: every single page, and every item of every collection.
 * The registry is the record of what real content exists, so registering a section is all it takes for
 * its pages to be announced here.
 *
 * An entry that has content takes its date and image from that content's own frontmatter. The rest are
 * aggregate pages with no date or image of their own, and report the build time.
 */
const contentUrls = (): MetadataRoute.Sitemap =>
    contentRegistry.flatMap((entry) => {
        const content = entry.content?.();

        if (content) {
            return content.map((item) => ({
                url: absoluteUrl(item.slug.formatted),
                lastModified: new Date(item.frontmatter.date.formatted),
                priority: 1,
                images: [absoluteUrl(item.frontmatter.image)],
            }));
        }

        return (entry.params?.() ?? [{}]).map((params) => ({
            url: absoluteUrl(slugFor(entry.slug, params)),
            lastModified: new Date(),
            changeFrequency: "yearly" as const,
            priority: 1,
            images: defaultImage,
        }));
    });

/**
 * Routes that index the posts rather than being content themselves: pagination, the archive, and the
 * tag and author listings. They have no registry entry because they have no content of their own —
 * they are views over the posts, derived from post frontmatter.
 */
const navigationUrls = (): MetadataRoute.Sitemap => {
    const listings = [slugs.blog.blogArchive, slugs.blog.tags, slugs.blog.authors];

    const paginationPages = Array.from(
        { length: getPostsTotalPages() },
        (_, index) => `${slugs.blog.blogPostsPage}/${index + 1}`,
    );

    const tagPages = getTags().map((tag) => tag.slug);

    const authorPages = getAuthorsWithPosts()
        .filter((entry) => entry.author.id !== ownerAuthorId)
        .map((entry) => slugs.blog.author.replace("[authorId]", authorIdToSlug(entry.author.id)));

    return [...listings, ...paginationPages, ...tagPages, ...authorPages].map((path) => ({
        url: absoluteUrl(path),
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 1,
        images: defaultImage,
    }));
};

export default function sitemap(): MetadataRoute.Sitemap {
    return [...contentUrls(), ...navigationUrls()];
}
