import { searchIndexFileName } from "@/lib/content/search-filename";
import { SearchablePostFields } from "@/types/search/search";
import elasticlunr from "elasticlunr";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getPosts } from "./posts";
import { Post } from "@/types/content/post";
import { getContent } from "@/lib/content/content";
import { Content } from "@/types/content/content";

const CACHE_FILE = ".search-index-cache";
const cachePath = path.join(process.cwd(), CACHE_FILE);

const computeContentHash = (posts: Post[], content: Content[]): string => {
  const postsSearchable = posts.map(post => ({
    slug: post.slug.formatted,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    tags: post.frontmatter.tags,
    authors: post.frontmatter.authors.map(a => a.name),
  }));

  const contentSearchable = content.map(c => ({
    slug: c.slug,
    title: c.frontmatter.title,
    description: c.frontmatter.description,
    tags: c.frontmatter.tags,
    authors: c.frontmatter.authors,
  }));

  const allContent = [...postsSearchable, ...contentSearchable];
  const contentString = JSON.stringify(allContent);
  return crypto.createHash('sha256').update(contentString).digest('hex');
};

const getCachedHash = (): string | null => {
  try {
    if (fs.existsSync(cachePath)) {
      return fs.readFileSync(cachePath, 'utf8').trim();
    }
  } catch (error) {
    console.warn('⚠️  Could not read cache file:', error);
  }
  return null;
};

const saveCachedHash = (hash: string): void => {
  try {
    fs.writeFileSync(cachePath, hash, 'utf8');
  } catch (error) {
    console.warn('⚠️  Could not write cache file:', error);
  }
};

const createSearchIndex = (posts: Post[], content: Content[]) => {
  const index = elasticlunr<SearchablePostFields>(function () {
    this.addField("title");
    this.addField("description");
    this.addField("tags");
    this.addField("authors");
    this.setRef("slug");
  });

  posts.forEach((post) =>
    index.addDoc({
      slug: post.slug.formatted,
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      tags: post.frontmatter.tags,
      authors: post.frontmatter.authors.map((author) => author.name),
    }),
  );

  content.forEach((c) =>
    index.addDoc({
      slug: c.slug,
      title: c.frontmatter.title,
      description: c.frontmatter.description,
      tags: c.frontmatter.tags,
      authors: c.frontmatter.authors.map((author) => author.name),
    }),
  );

  return index;
};

const generateAndSaveSearchIndex = () => {
  try {
    console.log('🔍 Checking if search index needs regeneration...');

    const posts = getPosts();
    const content = getContent();

    console.log(`📊 Content sources: ${posts.length} posts, ${content.length} other content items`);

    const currentHash = computeContentHash(posts, content);
    const cachedHash = getCachedHash();

    if (cachedHash === currentHash) {
      console.log('✨ Search index is up to date! Skipping regeneration.');
      return;
    }

    console.log('🚀 Content changed. Starting search index creation...');
    const index = createSearchIndex(posts, content);
    console.log(`✅ Index created successfully with ${posts.length + content.length} items!`);

    console.log('🚀 Writing index to file...');
    const serializedIndex = JSON.stringify(index);
    const outputPath = path.join(process.cwd(), "public", searchIndexFileName);
    fs.writeFileSync(outputPath, serializedIndex, "utf8");
    console.log('✅ Index written to file successfully!');

    saveCachedHash(currentHash);
    console.log('💾 Cache updated.');
  } catch (error) {
    console.error("Error generating search index:", error);
    process.exit(1);
  }
};

generateAndSaveSearchIndex();
