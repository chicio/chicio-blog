import { execSync } from "child_process";
import { generateAndSaveSearchIndex } from "@/lib/content/search";
import { copyContentMedia } from "@/lib/images/copy-content-media";

generateAndSaveSearchIndex();
copyContentMedia();
execSync("serwist build serwist.config.mjs", { stdio: "inherit" });
