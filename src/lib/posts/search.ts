import { searchIndexFileName } from "@/lib/posts/search-filename";
import { SearchablePostFields } from "@/types/search";
import elasticlunr from "elasticlunr";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getPosts } from "./posts";
import { Post } from "@/types/post";

const CACHE_FILE = ".search-index-cache";
const cachePath = path.join(process.cwd(), CACHE_FILE);

const computeContentHash = (posts: Post[]): string => {
  const searchableContent = posts.map(post => ({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    tags: post.frontmatter.tags,
    authors: post.frontmatter.authors.map(a => a.name),
    slug: post.frontmatter.slug.formatted,
  }));

  const contentString = JSON.stringify(searchableContent);
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

const createSearchIndex = (posts: Post[]) => {
  const index = elasticlunr<SearchablePostFields>(function () {
    this.addField("title");
    this.addField("description");
    this.addField("tags");
    this.addField("authors");
    this.setRef("slug");
  });

  posts.forEach((post) =>
    index.addDoc({
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      tags: post.frontmatter.tags,
      authors: post.frontmatter.authors.map((author) => author.name),
      slug: post.frontmatter.slug.formatted,
    }),
  );

  return index;
};

const generateAndSaveSearchIndex = () => {
  try {
    console.log('🔍 Checking if search index needs regeneration...');

    // Get all posts and compute content hash
    const posts = getPosts();
    const currentHash = computeContentHash(posts);
    const cachedHash = getCachedHash();

    // Check if content has changed
    if (cachedHash === currentHash) {
      console.log('✨ Search index is up to date! Skipping regeneration.');
      return;
    }

    console.log('🚀 Content changed. Starting search index creation...');
    const index = createSearchIndex(posts);
    console.log('✅ Index created successfully!');

    console.log('🚀 Writing index to file...');
    const serializedIndex = JSON.stringify(index);
    const outputPath = path.join(process.cwd(), "public", searchIndexFileName);
    fs.writeFileSync(outputPath, serializedIndex, "utf8");
    console.log('✅ Index written to file successfully!');

    // Save the new hash
    saveCachedHash(currentHash);
    console.log('💾 Cache updated.');
  } catch (error) {
    console.error("Error generating search index:", error);
    process.exit(1);
  }
};

generateAndSaveSearchIndex();
