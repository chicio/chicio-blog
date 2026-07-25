import { Content } from "@/types/content/content";
import { Tag } from "@/types/content/tag";
import { Author, AuthorSummary } from "@/types/content/author";
import { slugs } from "@/types/configuration/slug";
import { Pagination } from "@/types/content/pagination";
import { generateTagSlug } from "../../tags/tags";
import { createSection } from "../section";
import { paginate } from "@/lib/pagination/paginate";
import { authorSlugToId } from "../authors/author-slug";

export { authorIdToSlug, authorSlugToId, generateAuthorSlug } from "../authors/author-slug";

/**
 * POSTS
 */

export const posts = createSection({
  slug: slugs.blog.blogPost,
  sort: (post, anotherPost) =>
    new Date(anotherPost.frontmatter.date.formatted).getTime() -
    new Date(post.frontmatter.date.formatted).getTime(),
});

/**
 * PAGINATION
 */

const postsPerPage = 7;

export const groupArrayBy: <T>(array: T[], numberPerGroup: number) => T[][] = (
  data,
  n,
) => {
  const group = Array(0);
  for (let i = 0, j = 0; i < data.length; i += 1) {
    if (i >= n && i % n === 0) j += 1;
    group[j] = group[j] || [];
    group[j].push(data[i]);
  }
  return group;
};

export const getPostsTotalPages = () => Math.ceil(posts.list().length / postsPerPage)

/**
 * The blog's own presentation policy on top of the generic `paginate`: the page's first post
 * becomes the hero, the rest are paired for the two-column layout, and the prev/next hrefs follow
 * the blog URL scheme (page 2 links back to the listing root, not to `/blog/posts/1`).
 */
export const getPostsPaginationFor = (page: number): Pagination | undefined => {
  const postsPage = paginate(posts.list(), page, postsPerPage);

  if (!postsPage) {
    return undefined;
  }

  const previousPageUrl =
    page === 2 ? slugs.blog.home : `${slugs.blog.blogPostsPage}/${page - 1}`;

  return {
    launchPost: postsPage.items[0],
    postsGrouped: groupArrayBy(postsPage.items.slice(1), 2),
    previousPageUrl: postsPage.hasPrevious ? previousPageUrl : undefined,
    nextPageUrl: postsPage.hasNext
      ? `${slugs.blog.blogPostsPage}/${page + 1}`
      : undefined,
    totalPages: postsPage.totalPages,
  };
};

/**
 * TAGS
 */
export const getTags = () => {
  const tags = new Map<string, Tag>();
  const allPosts = posts.list();

  allPosts.map((post) =>
    post.frontmatter.tags.forEach((tag) => {
      if (tags.has(tag)) {
        const currentTag = tags.get(tag)!;

        tags.set(tag, { ...currentTag, count: ++currentTag.count });
      } else {
        const tagSlugText = tag.replaceAll(" ", "-");

        tags.set(tag, {
          tagValue: tag,
          count: 1,
          tagSlugText,
          slug: generateTagSlug(tag),
        });
      }
    }),
  );

  return [...tags.values()].sort((a, b) =>
    a.tagValue.toLowerCase() < b.tagValue.toLowerCase() ? -1 : 1,
  );
};

export const getPostsForTag: (tag: string) => Content[] = (tag: string) => {
  const allPosts = posts.list();

  return allPosts.filter((post) => post.frontmatter.tags.includes(tag));
};

/**
 * AUTHORS
 */

export const aggregateAuthorsWithPosts = (posts: Content[]): AuthorSummary[] => {
  const summaries = new Map<string, AuthorSummary>();

  posts.forEach((post) =>
    post.frontmatter.authors.forEach((author) => {
      const current = summaries.get(author.id);

      if (current) {
        summaries.set(author.id, { ...current, postCount: current.postCount + 1 });
      } else {
        summaries.set(author.id, { author, postCount: 1 });
      }
    }),
  );

  return [...summaries.values()].sort((a, b) =>
    a.author.name.toLowerCase() < b.author.name.toLowerCase() ? -1 : 1,
  );
};

export const getAuthorsWithPosts = (): AuthorSummary[] => aggregateAuthorsWithPosts(posts.list());

export const filterPostsForAuthor = (posts: Content[], authorId: string): Content[] =>
  posts.filter((post) => post.frontmatter.authors.some((author) => author.id === authorId));

export const findAuthorWithPostsBySlug = (
  posts: Content[],
  authorSlug: string,
): { author: Author; posts: Content[] } | undefined => {
  const authorId = authorSlugToId(authorSlug);
  const postsForAuthor = filterPostsForAuthor(posts, authorId);

  if (postsForAuthor.length === 0) {
    return undefined;
  }

  const author = postsForAuthor[0].frontmatter.authors.find((postAuthor) => postAuthor.id === authorId);

  if (!author) {
    return undefined;
  }

  return { author, posts: postsForAuthor };
};

export const getAuthorWithPostsBySlug = (
  authorSlug: string,
): { author: Author; posts: Content[] } | undefined => findAuthorWithPostsBySlug(posts.list(), authorSlug);

/**
 * READ NEXT
 */

export const rankReadNextPosts = (
  currentTags: string[],
  candidates: Content[],
  limit: number,
): Content[] => {
  const scored = candidates.map((post) => {
    const sharedTagCount = post.frontmatter.tags.filter((tag) =>
      currentTags.includes(tag),
    ).length;
    return { post, sharedTagCount };
  });

  scored.sort((a, b) => b.sharedTagCount - a.sharedTagCount);

  const related: Content[] = [];
  const fallback: Content[] = [];

  for (const { post, sharedTagCount } of scored) {
    if (sharedTagCount > 0 && related.length < limit) {
      related.push(post);
    } else {
      fallback.push(post);
    }
  }

  const result = [...related];
  for (const post of fallback) {
    if (result.length >= limit) break;
    result.push(post);
  }

  return result;
};

export const getReadNextPosts = (
  currentSlug: string,
  limit = 2,
): Content[] => {
  const allPosts = posts.list();
  const currentPost = allPosts.find(
    (post) => post.slug.formatted === currentSlug,
  );
  const candidates = allPosts.filter(
    (post) => post.slug.formatted !== currentSlug,
  );

  if (!currentPost) {
    return candidates.slice(0, limit);
  }

  return rankReadNextPosts(currentPost.frontmatter.tags, candidates, limit);
};
