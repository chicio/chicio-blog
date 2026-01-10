/**
 * Fabrizio Duroni
 * Script to fix relative imports in MDX files to use @/ alias
 */

import fs from "fs";
import path from "path";

const contentDirectory = path.join(process.cwd(), "src/content");

/**
 * Fix imports in a single MDX file
 */
function fixImportsInFile(filePath: string): boolean {
    try {
        let content = fs.readFileSync(filePath, "utf-8");
        let modified = false;

        // Pattern to match relative imports like:
        // import {Youtube} from "../../../../../../../../components/design-system/molecules/video/youtube"
        // import {AboutMePhoto} from "../../components/sections/about-me/components/about-me-photo"
        const relativeImportPattern = /from\s+["'](\.\.\/)+(components|lib|types|app)\/([^"']+)["']/g;

        content = content.replace(relativeImportPattern, (match, dots, folder, rest) => {
            modified = true;
            return `from "@/${folder}/${rest}"`;
        });

        if (modified) {
            fs.writeFileSync(filePath, content, "utf-8");
            console.log(`✅ Fixed imports in: ${path.relative(process.cwd(), filePath)}`);
            return true;
        }

        return false;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error);
        return false;
    }
}

/**
 * Recursively find and fix all MDX files
 */
function fixAllMdxFiles(dir: string): { total: number; fixed: number } {
    let total = 0;
    let fixed = 0;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            const result = fixAllMdxFiles(fullPath);
            total += result.total;
            fixed += result.fixed;
        } else if (entry.isFile() && (entry.name.endsWith(".mdx") || entry.name.endsWith(".md"))) {
            total++;
            if (fixImportsInFile(fullPath)) {
                fixed++;
            }
        }
    }

    return { total, fixed };
}

/**
 * Main function
 */
function main() {
    console.log("🔧 Fixing MDX imports to use @/ alias...\n");

    const result = fixAllMdxFiles(contentDirectory);

    console.log("\n" + "=".repeat(50));
    console.log("📊 Summary:");
    console.log(`   📄 Total MDX files: ${result.total}`);
    console.log(`   ✅ Files fixed: ${result.fixed}`);
    console.log(`   ⏭️  Files unchanged: ${result.total - result.fixed}`);
    console.log("=".repeat(50));

    if (result.fixed > 0) {
        console.log("\n✨ Import paths fixed successfully!");
    } else {
        console.log("\n✨ No imports needed fixing!");
    }
}

main();
