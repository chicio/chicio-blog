import fs from "fs";
import path from "path";

const MEDIA_EXTENSIONS = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".avif",
    ".svg",
    ".ico",
    ".mp4",
    ".webm",
]);

const contentRoot = path.join(process.cwd(), "src", "content");
const outputRoot = path.join(process.cwd(), "public", "media", "content");

function walkDir(dir: string, callback: (filePath: string) => void): void {
    if (!fs.existsSync(dir)) {
        return;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkDir(fullPath, callback);
        } else if (entry.isFile()) {
            callback(fullPath);
        }
    }
}

function cleanDirectory(dir: string): void {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
    fs.mkdirSync(dir, { recursive: true });
}

function computeOutputPath(sourcePath: string): string | null {
    const relative = path.relative(contentRoot, sourcePath);
    const segments = relative.split(path.sep);
    const mediaIdx = segments.indexOf("media");
    if (mediaIdx === -1) {
        return null;
    }
    const beforeMedia = segments.slice(0, mediaIdx);
    const afterMedia = segments.slice(mediaIdx + 1);
    const outputRelative = [...beforeMedia, ...afterMedia].join(path.sep);
    return path.join(outputRoot, outputRelative);
}

function copyContentMedia(): void {
    console.log("🖼️  Checking content media...");
    cleanDirectory(outputRoot);

    let count = 0;

    walkDir(contentRoot, (filePath) => {
        const ext = path.extname(filePath).toLowerCase();

        if (!MEDIA_EXTENSIONS.has(ext)) {
            return;
        }

        const outputPath = computeOutputPath(filePath);

        if (!outputPath) {
            return;
        }

        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.copyFileSync(filePath, outputPath);

        count++;
    });

    console.log(`✅ Copied ${count} media files to public/media/content/`);
}

export { copyContentMedia };
