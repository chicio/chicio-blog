import { Content } from "@/types/content/content";
import { getAllContentFor, getSingleContentBy } from "./content";
import { slugs } from "@/types/configuration/slug";
import { ExerciseMetadata } from "@/types/content/data-structures-and-algorithms";

const exerciseMetadataAdapter = (raw: unknown): ExerciseMetadata => {
  const { technique, leetcodeUrl } = raw as Record<string, string>;
  return { technique, leetcodeUrl };
};

export const getAllDataStructuresAndAlgorithmsTopics = (): Content[] =>
  getAllContentFor(slugs.dataStructuresAndAlgorithms.topic).sort(
    (topic, anotherTopic) =>
      new Date(topic.frontmatter.date.formatted).getTime() -
      new Date(anotherTopic.frontmatter.date.formatted).getTime(),
  );

export const getDataStructuresAndAlgorithmsTopic = (params: Record<string, string>): Content | undefined =>
  getSingleContentBy(slugs.dataStructuresAndAlgorithms.topic, params);

export const getDataStructuresAndAlgorithmsTopicWithNavigation =
 (params: Record<string, string>): { topic: Content; previousTopic?: Content; nextTopic?: Content } | undefined => {
  const topics = getAllDataStructuresAndAlgorithmsTopics()
  const slugToFind = slugs.dataStructuresAndAlgorithms.topic.replace('[topic]', params.topic);
  const topicIndex = topics.findIndex(t => t.slug.formatted === slugToFind);

  if (topicIndex === -1) {
    return undefined;
  }

  const topic = topics[topicIndex];
  const previousTopic = topicIndex > 0 ? topics[topicIndex - 1] : undefined;
  const nextTopic = topicIndex < topics.length - 1 ? topics[topicIndex + 1] : undefined;

  return {
    topic, 
    previousTopic,
    nextTopic
  }
};

export const getDataStructuresAndAlgorithmsRoadmap = (): Content =>
    getSingleContentBy(slugs.dataStructuresAndAlgorithms.roadmap)!;

export const getExercisesContent = (): Content =>
    getSingleContentBy(slugs.dataStructuresAndAlgorithms.exercises)!;

export const getAllExercises = (): Content<ExerciseMetadata>[] =>
  getAllContentFor<ExerciseMetadata>(slugs.dataStructuresAndAlgorithms.exercise, exerciseMetadataAdapter).sort(
    (a, b) =>
      new Date(a.frontmatter.date.formatted).getTime() -
      new Date(b.frontmatter.date.formatted).getTime(),
  );

export const getExercise = (params: Record<string, string>): Content<ExerciseMetadata> | undefined =>
  getSingleContentBy<ExerciseMetadata>(slugs.dataStructuresAndAlgorithms.exercise, params, exerciseMetadataAdapter);

export const getAllExercisesForTopic = (topic: string): Content<ExerciseMetadata>[] =>
  getAllExercises().filter((e) => e.slug.params.topic === topic);;