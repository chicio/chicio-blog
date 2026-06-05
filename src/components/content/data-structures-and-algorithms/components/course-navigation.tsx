import {
  BluePillLink,
  RedPillLink,
} from "@/components/design-system/molecules/links/pills-links";
import { tracking } from "@/types/configuration/tracking";
import { Content } from "@/types/content/content";
import { FC } from "react";

interface CourseNavigationProps {
    previousTopic?: Content
    nextTopic?: Content
}

export const CourseNavigation: FC<CourseNavigationProps> = ({ previousTopic, nextTopic }) => {
  return (
    <div className="mt-20 flex align-middle justify-center flex-row flex-wrap gap-4">
      {previousTopic && (
        <BluePillLink to={previousTopic.slug.formatted}
        trackingData={{
          category: tracking.category.data_structures_and_algorithms,
          label: tracking.label.body,
          action: tracking.action.blue_pill,
        }}
      >
        {previousTopic.frontmatter.title}
      </BluePillLink>)}
      {nextTopic && (
      <RedPillLink
        to={nextTopic.slug.formatted}
        trackingData={{
          category: tracking.category.data_structures_and_algorithms,
          label: tracking.label.body,
          action: tracking.action.red_pill,
        }}
      >
        {nextTopic.frontmatter.title}
      </RedPillLink>)}
    </div>
  );
};
