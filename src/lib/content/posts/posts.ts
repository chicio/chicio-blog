import { Content } from "@/types/content/content";
import { Tag } from "@/types/content/tag";
import { Author, AuthorSummary } from "@/types/content/author";
import { slugs } from "@/types/configuration/slug";
import { Pagination } from "@/types/content/pagination";
import { generateTagSlug } from "../../tags/tags";
import { getAllContentFor, getSingleContentBy } from "../content";
import { authorSlugToId } from "../authors/author-slug";

export { authorIdToSlug, authorSlugToId, generateAuthorSlug } from "../authors/author-slug";

/**
 * POSTS
 */

export const getPosts = (): Content[] =>
  getAllContentFor(slugs.blog.blogPost).sort(
    (post, anotherPost) =>
      new Date(anotherPost.frontmatter.date.formatted).getTime() -
      new Date(post.frontmatter.date.formatted).getTime(),
  );

export const getPostBy = (
  params: Record<string, string>,
): Content | undefined => {
  try {
    return getSingleContentBy(slugs.blog.blogPost, params);
  } catch {
    return undefined;
  }
};

/**
 * PAGINATION
 */

const postsPerPage = 7;

const groupArrayBy: <T>(array: T[], numberPerGroup: number) => T[][] = (
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

export const getPostsTotalPages = () => Math.ceil(getPosts().length / postsPerPage)

export const getPostsPaginationFor: (page: number) => Pagination | undefined = (
  page: number,
) => {
  try {
    const totalPages = getPostsTotalPages();

    if (totalPages < page) {
      throw new Error("Page does not exists");
    }
    const posts = getPosts();
    const start = (page - 1) * postsPerPage;
    const paginatedPosts = posts.slice(start, start + postsPerPage);
    const previousPageUrlSlug =
      page === 2
        ? `${slugs.blog.home}`
        : `${slugs.blog.blogPostsPage}/${page - 1}`;
    const previousPageUrl = page > 1 ? previousPageUrlSlug : undefined;
    const nextPageUrl =
      page < totalPages ? `${slugs.blog.blogPostsPage}/${page + 1}` : undefined;

    const postsGrouped = groupArrayBy(
      paginatedPosts.slice(1, paginatedPosts.length),
      2,
    );

    return {
      launchPost: paginatedPosts[0],
      postsGrouped,
      previousPageUrl,
      nextPageUrl,
      totalPages,
    };
  } catch {
    return undefined;
  }
};

/**
 * TAGS
 */
export const getTags = () => {
  const tags = new Map<string, Tag>();
  const posts = getPosts();

  posts.map((post) =>
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
  const posts = getPosts();

  return posts.filter((post) => post.frontmatter.tags.includes(tag));
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

export const getAuthorsWithPosts = (): AuthorSummary[] => aggregateAuthorsWithPosts(getPosts());

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
): { author: Author; posts: Content[] } | undefined => findAuthorWithPostsBySlug(getPosts(), authorSlug);

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
  const allPosts = getPosts();
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
