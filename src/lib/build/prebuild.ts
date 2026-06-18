import { execSync } from "child_process";
import { generateAndSaveSearchIndex } from "@/lib/content/search";
import { copyContentMedia } from "@/lib/images/copy-content-media";
import { validateArchitecture } from "@/lib/build/architecture/validate-architecture";

validateArchitecture();
generateAndSaveSearchIndex();
copyContentMedia();
execSync("serwist build serwist.config.mjs", { stdio: "inherit" });
