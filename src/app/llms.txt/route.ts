import { topics } from "@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms";
import { posts, getTags } from "@/lib/content/posts/posts";
import { contentRegistry } from "@/lib/content/registry";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

export const dynamic = "force-static";

/**
 * Labels for the pages that aggregate other content and so have no frontmatter of their own. Every
 * other page describes itself through its MDX, and nothing needs listing here to be announced: the page
 * list comes from the content registry, so a registered section is an advertised one.
 */
const aggregatePageLabels: Record<string, { title: string; description: string }> = {
    "/": { title: "Home", description: "Landing page with latest posts and featured content" },
    [slugs.blog.home]: { title: "Blog", description: "Technical articles and tutorials" },
    [slugs.blog.stats]: { title: "Blog Stats", description: "Publishing history and blog statistics" },
    [slugs.contact]: { title: "Contact", description: "Get in touch with Fabrizio" },
    [slugs.dataStructuresAndAlgorithms.home]: {
        title: "Data Structures & Algorithms",
        description: "A structured course covering data structures, algorithms and problem-solving techniques",
    },
    [slugs.videogames.home]: {
        title: "Videogames",
        description: "Personal videogame console and game collection",
    },
};

const mainPages = (): string =>
    contentRegistry
        .filter((entry) => !entry.params)
        .map((entry) => {
            const [content] = entry.content?.() ?? [];
            const label = aggregatePageLabels[entry.slug];
            const title = content?.frontmatter.title ?? label?.title ?? entry.slug;
            const description = content?.frontmatter.description ?? label?.description ?? "";

            return `- [${title}](${siteMetadata.siteUrl}${entry.slug === "/" ? "" : entry.slug}): ${description}`;
        })
        .join("\n");

export async function GET() {
    const allPosts = posts.list();
    const tags = getTags();
    const content = `# ${siteMetadata.title}

> ${siteMetadata.description}

> Personal blog by Fabrizio Duroni, a Software Engineer passionate about computer graphics, mobile development, and software engineering best practices.

This website contains technical blog posts about software engineering, computer graphics, mobile development, and web development, along with interactive tutorials on data structures and algorithms.

Every page is also available as Markdown: request it with the \`Accept: text/markdown\` header, or fetch ${siteMetadata.siteUrl}/markdown followed by the page path.

## Main Pages

${mainPages()}
- [Blog Archive](${siteMetadata.siteUrl}${slugs.blog.blogArchive}): Complete chronological archive of all blog posts
- [Blog Tags](${siteMetadata.siteUrl}${slugs.blog.tags}): Browse all available topic tags
- [Blog Authors](${siteMetadata.siteUrl}${slugs.blog.authors}): The people who write here
- [Chat](${siteMetadata.siteUrl}${slugs.chat}): AI-powered chat interface to discuss blog content

## Blog Posts

Articles with descriptions:

${allPosts
    .map(
        (post) =>
            `- [${post.frontmatter.title}](${siteMetadata.siteUrl}${post.slug.formatted}): ${post.frontmatter.description}`,
    )
    .join("\n")}

## Blog Tags

Browse posts by topic/tags:

${tags
    .map(
        (tag) =>
            `- [${tag.tagValue}](${siteMetadata.siteUrl}${tag.slug}): ${tag.count} ${tag.count === 1 ? "post" : "posts"}`,
    )
    .join("\n")}

## Data Structures & Algorithms

Interactive tutorials and educational content on fundamental computer science concepts:

${topics
    .list()
    .map(
        (topic) =>
            `- [${topic.frontmatter.title}](${siteMetadata.siteUrl}${topic.slug.formatted}): ${topic.frontmatter.description}`,
    )
    .join("\n")}

## Additional Information:

- [Blog Pagination](${siteMetadata.siteUrl}${slugs.blog.blogPostsPage}/2): Browse posts page by page. Pay attention that the first page is just ${siteMetadata.siteUrl}${slugs.blog.home}.
- Blog post URLs follow the pattern: ${siteMetadata.siteUrl}/blog/post/YYYY/MM/DD/slug
- Tag URLs follow the pattern: ${siteMetadata.siteUrl}${slugs.blog.tag}/tag-name
- Videogame URLs follow the pattern: ${siteMetadata.siteUrl}/videogames/console/console-name, then /game/game-name for a single game
- DSA exercise URLs follow the pattern: ${siteMetadata.siteUrl}/data-structures-and-algorithms/topic/topic-name/exercise/exercise-name
`;

    return new Response(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
