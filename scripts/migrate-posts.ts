/**
 * Fabrizio Duroni
 * Migration script to move blog posts from flat structure to nested structure
 */

import fs from "fs";
import path from "path";

const oldPostsDirectory = path.join(process.cwd(), "src/content/posts");
const contentDirectory = path.join(process.cwd(), "src/content");

interface ParsedPost {
    year: string;
    month: string;
    day: string;
    slug: string;
    originalFile: string;
    originalPath: string;
}

/**
 * Parse filename to extract date components and slug
 * Format: YYYY-MM-DD-slug-text.mdx
 */
function parseFilename(filename: string): ParsedPost | null {
    const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.(mdx|md)$/);

    if (!match) {
        return null;
    }

    const [, year, month, day, slug] = match;

    return {
        year,
        month,
        day,
        slug,
        originalFile: filename,
        originalPath: path.join(oldPostsDirectory, filename),
    };
}

/**
 * Get target path for nested structure
 * Target: src/content/blog/post/YYYY/MM/DD/slug/content.mdx
 */
function getTargetPath(post: ParsedPost): string {
    return path.join(
        contentDirectory,
        "blog",
        "post",
        post.year,
        post.month,
        post.day,
        post.slug,
        "content.mdx"
    );
}

/**
 * Migrate a single post file
 */
function migratePost(post: ParsedPost): boolean {
    const targetPath = getTargetPath(post);
    const targetDir = path.dirname(targetPath);

    // Check if target already exists
    if (fs.existsSync(targetPath)) {
        console.log(`⏭️  Skipping ${post.originalFile} (already migrated)`);
        return true;
    }

    try {
        // Create target directory
        fs.mkdirSync(targetDir, { recursive: true });

        // Read source file
        const content = fs.readFileSync(post.originalPath, "utf-8");

        // Write to target
        fs.writeFileSync(targetPath, content, "utf-8");

        console.log(`✅ Migrated ${post.originalFile}`);
        console.log(`   → ${path.relative(contentDirectory, targetPath)}`);

        return true;
    } catch (error) {
        console.error(`❌ Failed to migrate ${post.originalFile}:`, error);
        return false;
    }
}

/**
 * Main migration function
 */
function main() {
    console.log("🚀 Starting posts migration...\n");

    // Check if old posts directory exists
    if (!fs.existsSync(oldPostsDirectory)) {
        console.log("✨ No old posts directory found. Migration already completed or not needed!");
        return;
    }

    // Read all files in old posts directory
    const files = fs.readdirSync(oldPostsDirectory);

    // Filter and parse post files
    const posts: ParsedPost[] = files
        .map(parseFilename)
        .filter((post): post is ParsedPost => post !== null);

    console.log(`📝 Found ${posts.length} posts to migrate\n`);

    if (posts.length === 0) {
        console.log("✨ No posts to migrate!");
        return;
    }

    // Migrate each post
    let successCount = 0;
    let failCount = 0;

    for (const post of posts) {
        if (migratePost(post)) {
            successCount++;
        } else {
            failCount++;
        }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 Migration Summary:");
    console.log(`   ✅ Successfully migrated: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📦 Total: ${posts.length}`);
    console.log("=".repeat(50));

    if (failCount === 0) {
        console.log("\n✨ All posts migrated successfully!");
        console.log("\n⚠️  Next steps:");
        console.log("   1. Review the migrated files");
        console.log("   2. Test the site with: npm run dev");
        console.log("   3. If everything works, delete old flat files");
        console.log("   4. Commit the changes");
    } else {
        console.log("\n⚠️  Some posts failed to migrate. Please review the errors above.");
        process.exit(1);
    }
}

// Run migration
main();
