import fs from "fs";
import path from "path";

const CONTENT_VG = path.join(process.cwd(), "src", "content", "videogames");
const IMAGES_ROOT = path.join(CONTENT_VG, "images", "console");

let moved = 0;

// Walk each console in the images directory
for (const consoleName of fs.readdirSync(IMAGES_ROOT, { withFileTypes: true })) {
    if (!consoleName.isDirectory()) { continue; }
    
    // Skip manufacturer — it's shared, stays at videogames/images/console/manufacturer/
    if (consoleName.name === "manufacturer") {
        console.log(`⏭️  Skipping shared: manufacturer/`);
        continue;
    }

    const consoleImagesDir = path.join(IMAGES_ROOT, consoleName.name);
    const consoleContentDir = path.join(CONTENT_VG, "console", consoleName.name);

    if (!fs.existsSync(consoleContentDir)) {
        console.warn(`⚠️  No content dir for console: ${consoleName.name}`);
        continue;
    }

    for (const entry of fs.readdirSync(consoleImagesDir, { withFileTypes: true })) {
        if (entry.name === ".DS_Store") { continue; }

        if (entry.name === "game" && entry.isDirectory()) {
            // Game images: move each game's images to game/<game>/images/
            const gamesDir = path.join(consoleImagesDir, "game");
            for (const gameName of fs.readdirSync(gamesDir, { withFileTypes: true })) {
                if (!gameName.isDirectory() || gameName.name === ".DS_Store") { continue; }

                const gameImagesSrc = path.join(gamesDir, gameName.name);
                const gameContentDir = path.join(consoleContentDir, "game", gameName.name);
                const gameImagesDest = path.join(gameContentDir, "images");

                if (!fs.existsSync(gameContentDir)) {
                    console.warn(`⚠️  No content dir for game: ${consoleName.name}/${gameName.name}`);
                    continue;
                }

                fs.mkdirSync(gameImagesDest, { recursive: true });
                // Move all contents (cover.png, gameplay/, media/)
                moveContents(gameImagesSrc, gameImagesDest);
                console.log(`✅ ${consoleName.name}/game/${gameName.name}/`);
            }
        } else {
            // Console-level images (gallery/, direct files): move to console/<name>/images/
            const consoleImagesDest = path.join(consoleContentDir, "images");
            fs.mkdirSync(consoleImagesDest, { recursive: true });
            const src = path.join(consoleImagesDir, entry.name);
            const dest = path.join(consoleImagesDest, entry.name);
            if (entry.isDirectory()) {
                moveDir(src, dest);
            } else {
                fs.renameSync(src, dest);
                moved++;
            }
            console.log(`✅ ${consoleName.name}/${entry.name}`);
        }
    }
}

function moveContents(src: string, dest: string): void {
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        if (entry.name === ".DS_Store") { continue; }
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            moveDir(srcPath, destPath);
        } else {
            fs.renameSync(srcPath, destPath);
            moved++;
        }
    }
}

function moveDir(src: string, dest: string): void {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        if (entry.name === ".DS_Store") { continue; }
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            moveDir(srcPath, destPath);
        } else {
            fs.renameSync(srcPath, destPath);
            moved++;
        }
    }
}

// Clean up empty directories left behind
function removeEmptyDirs(dir: string): void {
    if (!fs.existsSync(dir)) { return; }
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            removeEmptyDirs(path.join(dir, entry.name));
        }
    }
    const remaining = fs.readdirSync(dir).filter(f => f !== ".DS_Store");
    if (remaining.length === 0) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

// Clean up the old structure (keep manufacturer/)
for (const consoleName of fs.readdirSync(IMAGES_ROOT, { withFileTypes: true })) {
    if (consoleName.name === "manufacturer" || !consoleName.isDirectory()) { continue; }
    removeEmptyDirs(path.join(IMAGES_ROOT, consoleName.name));
}

console.log(`\n✅ Redistributed ${moved} files.`);

// Verify manufacturer still exists
const mfgDir = path.join(IMAGES_ROOT, "manufacturer");
if (fs.existsSync(mfgDir)) {
    console.log(`📁 manufacturer/ preserved at videogames/images/console/manufacturer/`);
}
