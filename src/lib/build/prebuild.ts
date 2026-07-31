import { execSync } from "child_process";
import { generateAndSaveSearchIndex } from "@/lib/content/search";
import { generateAndSaveFilesystemManifest } from "@/lib/build/filesystem-manifest";
import { copyContentMedia } from "@/lib/images/copy-content-media";
import { reportTableOfContentsGaps } from "@/lib/build/table-of-contents-report";

generateAndSaveSearchIndex();
generateAndSaveFilesystemManifest();
reportTableOfContentsGaps();
copyContentMedia();
execSync("serwist build serwist.config.mjs", { stdio: "inherit" });
