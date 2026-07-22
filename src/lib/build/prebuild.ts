import { execSync } from "child_process";
import { generateAndSaveSearchIndex } from "@/lib/content/search";
import { generateAndSaveFilesystemManifest } from "@/lib/build/filesystem-manifest";
import { copyContentMedia } from "@/lib/images/copy-content-media";

generateAndSaveSearchIndex();
generateAndSaveFilesystemManifest();
copyContentMedia();
execSync("serwist build serwist.config.mjs", { stdio: "inherit" });
