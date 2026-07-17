import {
    easterEggHints,
    easterEggHuntIntroLines,
    easterEggHuntPageDescription,
    easterEggHuntPageTitle,
} from "@/lib/content/easter-eggs/easter-eggs-content";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

export const easterEggHuntMarkdown = (): string => {
    const hintsMarkdown = easterEggHints
        .map(
            (hint) => `## ${hint.title}

${hint.crypticHint}

**Solution:**

${hint.solutionSteps.map((step, index) => `${index + 1}. ${step}`).join("\n")}
`,
        )
        .join("\n");

    return `# ${easterEggHuntPageTitle}

> ${easterEggHuntPageDescription}

**URL:** ${siteMetadata.siteUrl}${slugs.easterEggHunt}

${easterEggHuntIntroLines.join("\n\n")}

${hintsMarkdown}`;
};
