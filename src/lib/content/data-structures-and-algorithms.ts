import { Content } from "@/types/content/content";
import { getAllContentFor, getSingleContentBy } from "./content";
import { slugs } from "@/types/configuration/slug";

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
  const topicIndex = topics.findIndex(t => t.slug.formatted === `${slugs.dataStructuresAndAlgorithms.topic}/${params.topic}`);

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