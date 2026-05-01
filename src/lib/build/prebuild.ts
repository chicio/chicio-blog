import { execSync } from "child_process";

function run(command: string): void {
    console.log(`\n> ${command}`);
    execSync(command, { stdio: "inherit" });
}

run("tsx src/lib/content/search.ts");
run("tsx src/lib/images/copy-content-images.ts");
