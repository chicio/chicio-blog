import { getPosts, getTags } from "@/lib/posts/posts";
import { siteMetadata } from "@/types/site-metadata";
import { slugs } from "@/types/slug";

export const dynamic = 'force-static';

export async function GET() {
    const posts = getPosts();
    const tags = getTags();
    const content = `# ${siteMetadata.title}

> ${siteMetadata.description}

> Personal blog by Fabrizio Duroni, a Software Engineer passionate about computer graphics, mobile development, and software engineering best practices.

This website contains technical blog posts about software engineering, computer graphics, mobile development, and web development, along with interactive tutorials on data structures and algorithms.

## Main Pages

- [Home](${siteMetadata.siteUrl}): Landing page with latest posts and featured content
- [Blog](${siteMetadata.siteUrl}${slugs.blog}): Main blog section with technical articles and tutorials
- [Blog Archive](${siteMetadata.siteUrl}${slugs.blog.blogArchive}): Complete chronological archive of all blog posts
- [Blog Tags](${siteMetadata.siteUrl}${slugs.blog.tags}): Browse all available topic tags
- [Chat](${siteMetadata.siteUrl}${slugs.chat}): AI-powered chat interface to discuss blog content
- [Art](${siteMetadata.siteUrl}${slugs.art}): Creative and artistic projects showcase
- [About Me](${siteMetadata.siteUrl}${slugs.aboutMe}): Author bio and professional background
- [Cookie Policy](${siteMetadata.siteUrl}${slugs.cookiePolicy}): Privacy and cookie usage information

## Blog Posts

Articles with descriptions:

${posts
    .map(
        (post) =>
            `- [${post.frontmatter.title}](${siteMetadata.siteUrl}${post.frontmatter.slug.formatted}): ${post.frontmatter.description}`
    )
    .join("\n")}

## Blog Tags

Browse posts by topic/tags:

${tags
    .map((tag) => `- [${tag.tagValue}](${siteMetadata.siteUrl}${tag.slug}): ${tag.count} ${tag.count === 1 ? "post" : "posts"}`)
    .join("\n")}    

## Data Structures & Algorithms

Interactive tutorials and educational content on fundamental computer science concepts:

- [DSA Roadmap](${siteMetadata.siteUrl}${slugs.dsa.roadmap}): Complete learning path for data structures and algorithms
- [Time & Space Complexity](${siteMetadata.siteUrl}${slugs.dsa.timeAndSpaceComplexity}): Understanding algorithm efficiency and Big O notation
- [Arrays](${siteMetadata.siteUrl}${slugs.dsa.arrays}): Fundamental data structure for sequential storage
- [Strings](${siteMetadata.siteUrl}${slugs.dsa.strings}): String manipulation and pattern matching
- [Bit Manipulation](${siteMetadata.siteUrl}${slugs.dsa.bitManipulation}): Binary operations and bitwise techniques
- [Hash Tables](${siteMetadata.siteUrl}${slugs.dsa.hashTables}): Key-value storage and constant-time lookups
- [Two Pointers](${siteMetadata.siteUrl}${slugs.dsa.twoPointers}): Efficient array traversal technique
- [Prefix Sum](${siteMetadata.siteUrl}${slugs.dsa.prefixSum}): Range query optimization technique
- [Sliding Window](${siteMetadata.siteUrl}${slugs.dsa.slidingWindow}): Subarray and substring problem pattern
- [Kadane's Algorithm](${siteMetadata.siteUrl}${slugs.dsa.kadaneAlgorithm}): Maximum subarray sum solution    
- [Matrix](${siteMetadata.siteUrl}${slugs.dsa.matrix}): Matrix operations and algorithms
- [Linked Lists](${siteMetadata.siteUrl}${slugs.dsa.linkedList}): Dynamic data structure for sequential storage
- [Stack](${siteMetadata.siteUrl}${slugs.dsa.stack}): LIFO and FIFO data structures   

## Additional Information:

- [Blog Pagination](${siteMetadata.siteUrl}${slugs.blog.blogPostsPage}/1): Browse posts page by page
- Blog post URLs follow the pattern: ${siteMetadata.siteUrl}${slugs.blog.blogPost}/YYYY/MM/DD/slug
- Tag URLs follow the pattern: ${siteMetadata.siteUrl}${slugs.blog.tag}/tag-name
`;

    return new Response(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
