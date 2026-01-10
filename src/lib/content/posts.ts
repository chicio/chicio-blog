import { Content } from "@/types/content/content";
import { Tag } from "@/types/content/tag";
import { slugs } from "@/types/configuration/slug";
import { Pagination } from "@/types/content/pagination";
import { generateTagSlug } from "../tags/tags";
import { getAllContentFor, getSingleContentBy } from "./content";

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

export const getPostsTotalPages = (posts: Content[]) =>
  Math.ceil(posts.length / postsPerPage);

export const getPostsPaginationFor: (page: number) => Pagination | undefined = (
  page: number,
) => {
  try {
    const posts = getPosts();
    const totalPages = getPostsTotalPages(posts);

    if (totalPages < page) {
      throw new Error("Page does not exists");
    }

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
