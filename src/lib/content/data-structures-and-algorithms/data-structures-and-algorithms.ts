import { Content } from "@/types/content/content";
import { createSection } from "../section";
import { slugs } from "@/types/configuration/slug";
import { ExerciseMetadata } from "@/types/content/data-structures-and-algorithms";

const byDateAsc = <TMeta>(a: Content<TMeta>, b: Content<TMeta>): number =>
  new Date(a.frontmatter.date.formatted).getTime() - new Date(b.frontmatter.date.formatted).getTime();

export const topics = createSection({
  slug: slugs.dataStructuresAndAlgorithms.topic,
  sort: byDateAsc,
});

export const exercises = createSection<ExerciseMetadata>({
  slug: slugs.dataStructuresAndAlgorithms.exercise,
  sort: byDateAsc,
});

export const dsaRoadmap = createSection({ slug: slugs.dataStructuresAndAlgorithms.roadmap });

export const dsaExercisesList = createSection({ slug: slugs.dataStructuresAndAlgorithms.exercises });

export const getDataStructuresAndAlgorithmsTopicWithNavigation =
 (params: Record<string, string>): { topic: Content; previousTopic?: Content; nextTopic?: Content } | undefined => {
  const allTopics = topics.list()
  const slugToFind = slugs.dataStructuresAndAlgorithms.topic.replace('[topic]', params.topic);
  const topicIndex = allTopics.findIndex(t => t.slug.formatted === slugToFind);

  if (topicIndex === -1) {
    return undefined;
  }

  const topic = allTopics[topicIndex];
  const previousTopic = topicIndex > 0 ? allTopics[topicIndex - 1] : undefined;
  const nextTopic = topicIndex < allTopics.length - 1 ? allTopics[topicIndex + 1] : undefined;

  return {
    topic,
    previousTopic,
    nextTopic
  }
};

export const getAllExercisesForTopic = (topic: string): Content<ExerciseMetadata>[] =>
  exercises.list().filter((e) => e.slug.params.topic === topic);
