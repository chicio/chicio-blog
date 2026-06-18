import { execSync } from "child_process";
import { generateAndSaveSearchIndex } from "@/lib/content/search";
import { copyContentMedia } from "@/lib/images/copy-content-media";

try {
    execSync("depcruise src --config .dependency-cruiser.js", { stdio: "inherit" });
} catch {
    console.warn("[prebuild] dependency-cruiser reported violations (non-failing during migration).");
}

generateAndSaveSearchIndex();
copyContentMedia();
execSync("serwist build serwist.config.mjs", { stdio: "inherit" });
