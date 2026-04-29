import {
    getAllDataStructuresAndAlgorithmsTopics,
    getAllExercises,
    getAllExercisesForTopic,
    getDataStructuresAndAlgorithmsRoadmap,
    getDataStructuresAndAlgorithmsTopic,
    getExercise,
    getExercisesContent,
} from "@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

export const dsaMarkdown = (): string => {
    const topics = getAllDataStructuresAndAlgorithmsTopics();

    return `# Data Structures & Algorithms — ${siteMetadata.title}

A structured course covering fundamental data structures, algorithms, and problem-solving techniques.

**URL:** ${siteMetadata.siteUrl}${slugs.dataStructuresAndAlgorithms.home}

## Topics

${topics.map((topic) => `- [${topic.frontmatter.title}](${siteMetadata.siteUrl}${topic.slug.formatted}) — ${topic.frontmatter.description}`).join("\n")}
`;
};

export const dsaRoadmapMarkdown = (): string => {
    const roadmap = getDataStructuresAndAlgorithmsRoadmap();

    return `# ${roadmap.frontmatter.title}

> ${roadmap.frontmatter.description}

**URL:** ${siteMetadata.siteUrl}${slugs.dataStructuresAndAlgorithms.roadmap}

---

${roadmap.content}
`;
};

export const dsaExercisesListMarkdown = (): string => {
    const exercisesContent = getExercisesContent();
    const exercises = getAllExercises();

    return `# ${exercisesContent.frontmatter.title}

> ${exercisesContent.frontmatter.description}

**URL:** ${siteMetadata.siteUrl}${slugs.dataStructuresAndAlgorithms.exercises}

## All Exercises (${exercises.length})

${exercises.map((e) => `- [${e.frontmatter.title}](${siteMetadata.siteUrl}${e.slug.formatted}) — ${e.frontmatter.metadata?.difficulty ?? "unknown"}, ${e.frontmatter.metadata?.technique ?? "unknown"}`).join("\n")}
`;
};

export const dsaTopicMarkdown = (params: Record<string, string>): string | null => {
    const topic = getDataStructuresAndAlgorithmsTopic(params);

    if (!topic) {
        return null;
    }

    const exercises = getAllExercisesForTopic(params.topic);

    return `# ${topic.frontmatter.title}

> ${topic.frontmatter.description}

**Tags:** ${topic.frontmatter.tags.join(", ")}
**URL:** ${siteMetadata.siteUrl}${topic.slug.formatted}

---

${topic.content}
${exercises.length > 0 ? `
## Exercises

${exercises.map((e) => `- [${e.frontmatter.title}](${siteMetadata.siteUrl}${e.slug.formatted}) — ${e.frontmatter.metadata?.difficulty ?? "unknown"}, ${e.frontmatter.metadata?.technique ?? "unknown"}`).join("\n")}
` : ""}`;
};

export const dsaExerciseMarkdown = (params: Record<string, string>): string | null => {
    const exercise = getExercise(params);

    if (!exercise) {
        return null;
    }

    const { frontmatter, content, slug } = exercise;

    return `# ${frontmatter.title}

> ${frontmatter.description}

**Difficulty:** ${frontmatter.metadata?.difficulty ?? "unknown"}
**Technique:** ${frontmatter.metadata?.technique ?? "unknown"}
**Tags:** ${frontmatter.tags.join(", ")}
**URL:** ${siteMetadata.siteUrl}${slug.formatted}
${frontmatter.metadata?.leetcodeUrl ? `**LeetCode:** ${frontmatter.metadata.leetcodeUrl}` : ""}

---

${content}
`;
};
