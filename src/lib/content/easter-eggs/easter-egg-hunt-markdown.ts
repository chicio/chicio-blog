import {
    easterEggHints,
    easterEggHuntIntroLines,
    easterEggHuntPageDescription,
    easterEggHuntPageTitle,
} from "@/lib/content/easter-eggs/easter-eggs-content";
import { markdownDocument } from "@/lib/mdx/markdown-document";
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

    const body = `${easterEggHuntIntroLines.join("\n\n")}

${hintsMarkdown}`;

    return markdownDocument({
        title: easterEggHuntPageTitle,
        description: easterEggHuntPageDescription,
        slug: slugs.easterEggHunt,
        body,
    });
};
