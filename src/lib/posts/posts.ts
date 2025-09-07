import path from "path";
import { Post, Tag } from "@/types/post";
import { slugs } from "@/types/slug";
import { getPostFromFilePath } from "@/lib/posts/post";
import { getPostsUsing } from "@/lib/posts/posts-with-parser";
import { mdExtension } from "@/lib/posts/files";
import { postsDirectory } from "@/lib/posts/post-dir";
import { Pagination } from "@/types/pagination";

const postsPerPage = 7;

const generateFileNameFrom = (
  year: string,
  month: string,
  day: string,
  slug: string
) => {
  return `${year}-${month}-${day}-${slug}${mdExtension}`;
};

const groupArrayBy: <T>(array: T[], numberPerGroup: number) => T[][] = (
  data,
  n
) => {
  const group = Array(0);
  for (let i = 0, j = 0; i < data.length; i += 1) {
    if (i >= n && i % n === 0) j += 1;
    group[j] = group[j] || [];
    group[j].push(data[i]);
  }
  return group;
};

/**
 * POSTS
 */

export const getPosts: () => Post[] = getPostsUsing(getPostFromFilePath);

export const getPostBy = (
  year: string,
  month: string,
  day: string,
  slug: string
): Post | undefined => {
  try {
    const fileName = generateFileNameFrom(year, month, day, slug);
    return getPostFromFilePath(path.join(postsDirectory, fileName), fileName);
  } catch {
    return undefined;
  }
};

/**
 * PAGINATION
 */

export const getPostsTotalPages = (posts: Post[]) =>
  Math.ceil(posts.length / postsPerPage);

export const getPostsPaginationFor: (page: number) => Pagination | undefined = (
  page: number
) => {
  try {
    const posts = getPosts();
    const totalPages = getPostsTotalPages(posts);

    if (totalPages < page) {
      throw new Error("Page does not exists");
    }

    const start = (page - 1) * postsPerPage;
    const paginatedPosts = posts.slice(start, start + postsPerPage);
    const previousPageUrl =
      page > 1 ? `${slugs.blogPostsPage}/${page - 1}` : undefined;
    const nextPageUrl =
      page < totalPages ? `${slugs.blogPostsPage}/${page + 1}` : undefined;

    const postsGrouped = groupArrayBy(
      paginatedPosts.slice(1, paginatedPosts.length),
      2
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
          slug: `${slugs.tag}/${tagSlugText}`,
        });
      }
    })
  );

  return [...tags.values()].sort((a, b) =>
    a.tagValue.toLowerCase() < b.tagValue.toLowerCase() ? -1 : 1
  );
};

export const getPostsForTag: (tag: string) => Post[] = (tag: string) => {
  const posts = getPosts();

  return posts.filter((post) => post.frontmatter.tags.includes(tag));
};
