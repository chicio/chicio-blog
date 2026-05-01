import { execSync } from "child_process";
import { generateAndSaveSearchIndex } from "@/lib/content/search";
import { copyContentImages } from "@/lib/images/copy-content-images";

generateAndSaveSearchIndex();
copyContentImages();
execSync("serwist build serwist.config.mjs", { stdio: "inherit" });
