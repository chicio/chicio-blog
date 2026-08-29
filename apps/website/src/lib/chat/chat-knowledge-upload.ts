import { siteMetadata } from "@/types/configuration/site-metadata";
import { upsert } from "../upstash/upstash-vector";
import { VectorData } from "@/types/chat/vector-data";
import { Content } from "@/types/content/content";
import { posts } from "../content/posts/posts";

function chunkContent(content: string, maxChunkSize: number = 1000): string[] {
  const paragraphs = content.split("\n\n").filter((p) => p.trim());
  const chunks: string[] = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }

      if (paragraph.length > maxChunkSize) {
        const sentences = paragraph.split(/[.!?]+/).filter((s) => s.trim());
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length > maxChunkSize) {
            if (currentChunk) {
              chunks.push(currentChunk.trim());
              currentChunk = "";
            }
          }
          currentChunk += sentence + ". ";
        }
      } else {
        currentChunk = paragraph;
      }
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

const getTitlesArgs = () => {
  const titlesArg = process.argv[2];
  const titlesToIndex = titlesArg ? JSON.parse(titlesArg) : [];

  if (!Array.isArray(titlesToIndex) || titlesToIndex.length === 0) {
    console.log(
      "⚠️  Nessun titolo passato come parametro. Indicizzazione annullata."
    );
    process.exit(0);
  }

  return titlesToIndex;
};

const getPostWithTitles = (titlesToIndex: string[]) =>
  posts.list().filter((post) =>
    titlesToIndex.includes(post.frontmatter.title)
  );

const getVectorPosts = (posts: Content[]) => {
  const vectorData: VectorData[] = [];

  for (const post of posts) {
    console.log(`📄 Processing: ${post.frontmatter.title}`);

    const chunks = chunkContent(post.content, 800);
    console.log(`  ✂️  Created ${chunks.length} chunks`);

    chunks.forEach((chunk, index) => {
      vectorData.push({
        id: `${post.slug.formatted}-chunk-${index}`,
        data: chunk,
        metadata: {
          postId: post.slug.formatted,
          postTitle: post.frontmatter.title,
          postDate: post.frontmatter.date.formatted,
          postUrl: `${siteMetadata.siteUrl}${post.slug.formatted}`,
          postDescription: post.frontmatter.description,
          postTags: post.frontmatter.tags,
          postAuthors: post.frontmatter.authors.map((a) => a.name),
          chunkIndex: index,
          content: chunk,
        },
      });
    });
  }

  return vectorData;
};

const uploadVectorData = async (vectorData: VectorData[]) => {
  const batchSize = 5;
  for (let i = 0; i < vectorData.length; i += batchSize) {
    const batch = vectorData.slice(i, i + batchSize);
    await upsert(batch);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
};

async function indexPosts() {
  try {
    console.log("🚀 Starting posts indexing...");
    const titles = getTitlesArgs();
    const posts = getPostWithTitles(titles);
    console.log(`📚 Found ${posts.length} posts to index`, posts);
    const vectorData: VectorData[] = getVectorPosts(posts);
    console.log(`🔢 Total vectors to upload: ${vectorData.length}`);
    await uploadVectorData(vectorData);
    console.log("✅ Indexing completed successfully!");
  } catch (error) {
    console.error("❌ Error during indexing:", error);
    process.exit(1);
  }
}

// Esegui lo script
indexPosts();
