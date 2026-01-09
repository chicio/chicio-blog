import { searchIndexFileName } from "@/lib/posts/search-filename";
import { SearchablePostFields } from "@/types/search";
import elasticlunr from "elasticlunr";
import fs from "fs";
import path from "path";
import { getPosts } from "./posts";

const createSearchIndex = () => {
  const posts = getPosts();

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
    console.log('🚀 Starting search index creation...');
    const index = createSearchIndex();
    console.log('✅ Index created successfully!');
    console.log('🚀 Writing index to file...');
    const serializedIndex = JSON.stringify(index);
    const outputPath = path.join(process.cwd(), "public", searchIndexFileName);
    fs.writeFileSync(outputPath, serializedIndex, "utf8");
    console.log('✅ Index written to file successfully!');
  } catch (error) {
    console.error("Error generating search index:", error);
    process.exit(1);
  }
};

generateAndSaveSearchIndex();
