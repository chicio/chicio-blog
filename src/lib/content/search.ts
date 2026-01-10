import { searchIndexFileName } from "@/lib/content/search-filename";
import { SearchablePostFields } from "@/types/search/search";
import elasticlunr from "elasticlunr";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getPosts } from "./posts";
import { Content } from "@/types/content/content";
import { getAllContentFor } from "@/lib/content/content";
import { getAllDataStructuresAndAlgorithmsTopics, getDataStructuresAndAlgorithmsRoadmap } from "./data-structures-and-algorithms";
import { getAboutMe } from "./about-me";
import { getIndexableContent } from "./indexable-content";

const CACHE_FILE = ".search-index-cache";
const cachePath = path.join(process.cwd(), CACHE_FILE);

const computeContentHash = (contents: Content[]): string => {
  const postsSearchable = contents.map(content => ({
    slug: content.slug.formatted,
    title: content.frontmatter.title,
    description: content.frontmatter.description,
    tags: content.frontmatter.tags,
    authors: content.frontmatter.authors.map(a => a.name),
  }));

  const contentSearchable = contents.map(content => ({
    slug: content.slug,
    title: content.frontmatter.title,
    description: content.frontmatter.description,
    tags: content.frontmatter.tags,
    authors: content.frontmatter.authors.map(a => a.name),
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

const createSearchIndex = (contents: Content[]) => {
  const index = elasticlunr<SearchablePostFields>(function () {
    this.addField("title");
    this.addField("description");
    this.addField("tags");
    this.addField("authors");
    this.setRef("slug");
  });

  contents.forEach((post) =>
    index.addDoc({
      slug: post.slug.formatted,
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      tags: post.frontmatter.tags,
      authors: post.frontmatter.authors.map((author) => author.name),
    }),
  );

  contents.forEach((content) =>
    index.addDoc({
      slug: content.slug.formatted,
      title: content.frontmatter.title,
      description: content.frontmatter.description,
      tags: content.frontmatter.tags,
      authors: content.frontmatter.authors.map((author) => author.name),
    }),
  );

  return index;
};

const generateAndSaveSearchIndex = () => {
  try {
    console.log('🔍 Checking if search index needs regeneration...');

    const searchableContent = getIndexableContent();

    console.log(`📊 Content sources: ${searchableContent.length} posts, ${searchableContent.length} other content items`);

    const currentHash = computeContentHash(searchableContent);
    const cachedHash = getCachedHash();

    if (cachedHash === currentHash) {
      console.log('✨ Search index is up to date! Skipping regeneration.');
      return;
    }

    console.log('🚀 Content changed. Starting search index creation...');
    const index = createSearchIndex(searchableContent);
    console.log(`✅ Index created successfully with ${searchableContent.length} items!`);

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
