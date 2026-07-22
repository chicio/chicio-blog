import fs from "fs";
import path from "path";
import { filesystemManifestFileName } from "@/lib/terminal/filesystem-filename";
import { generateFilesystemManifest } from "./filesystem-manifest-factory";

const generateAndSaveFilesystemManifest = () => {
    try {
        console.log("🗂️  Generating terminal filesystem manifest...");

        const manifest = generateFilesystemManifest();
        const serializedManifest = JSON.stringify(manifest);
        const outputPath = path.join(process.cwd(), "public", filesystemManifestFileName);

        fs.writeFileSync(outputPath, serializedManifest, "utf8");
        console.log("✅ Filesystem manifest written to file successfully!");
    } catch (error) {
        console.error("Error generating filesystem manifest:", error);
        process.exit(1);
    }
};

export { generateAndSaveFilesystemManifest };
