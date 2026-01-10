import { Post, PostParser, PostSlug, Tag } from "@/types/content/post";
import { slugs } from "@/types/slug";
import { Pagination } from "@/types/pagination";
import { generateTagSlug } from "../tags/tags";
import fs from "fs";
import path from "path";
<<<<<<< Updated upstream
import matter from "gray-matter";
import { grayMatterPost } from "@/lib/content/gray-matter";
=======
import { grayMatterContent } from "@/lib/content/gray-matter";
>>>>>>> Stashed changes
import calculateReadingTime from "reading-time";
import { file } from "zod";

const postsDirectory = path.join(process.cwd(), "src/content/posts");
const postsPerPage = 7;

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

const generatePostSlugFrom = (filename: string): PostSlug => {
  const [year, month, day, ...slug] = filename.split("-");
  const text = slug.join("-");

  return {
    year,
    month,
    day,
    text: text,
    formatted: `${slugs.blog.blogPost}/${year}/${month}/${day}/${text}`,
  };
};

/**
 * POSTS
 */

const getPost: PostParser = (fileName, extension) => {
  const filePath = path.join(postsDirectory, `${fileName}${extension}`);
<<<<<<< Updated upstream
  const fileContents = fs.readFileSync(filePath, "utf8");
  const fileParsed = matter(fileContents);

  const { frontmatter, content} = grayMatterPost(filePath);
=======
  const { frontmatter, content } = grayMatterContent(filePath);
>>>>>>> Stashed changes

  return {
    frontmatter,
    slug: generatePostSlugFrom(fileName),
    readingTime: calculateReadingTime(fileParsed.content),
    fileName,
    content,
  };
};

const getPostsUsing = (parser: PostParser) => (): Post[] =>
    fs  
        .readdirSync(postsDirectory)
        .map((fileName) => { 
            const { name, ext } = path.parse(fileName);
            return parser(name, ext);
        })
        .sort((a, b) => new Date(b.frontmatter.date.formatted).getTime() - new Date(a.frontmatter.date.formatted).getTime());


export const getPosts: () => Post[] = getPostsUsing(getPost);

export const getPostBy = (
  year: string,
  month: string,
  day: string,
  slug: string
): Post | undefined => {
  try {
    const fileName = `${year}-${month}-${day}-${slug}`;
    return getPost(fileName, ".mdx");
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
    const previousPageUrlSlug = page === 2 ? `${slugs.blog.home}` : `${slugs.blog.blogPostsPage}/${page - 1}`;
    const previousPageUrl =
      page > 1 ? previousPageUrlSlug : undefined;
    const nextPageUrl =
      page < totalPages ? `${slugs.blog.blogPostsPage}/${page + 1}` : undefined;

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
          slug: generateTagSlug(tag),
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
