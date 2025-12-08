import {
  BluePillLink,
  RedPillLink,
} from "@/components/design-system/molecules/links/pills-links";
import { tracking } from "@/types/tracking";
import { FC } from "react";

interface CourseNavigationProps {
    previousTopic?: {
        url: string;
        title: string;
    }
    nextTopic?: {
        url: string;
        title: string;
    }
}

export const CourseNavigation: FC<CourseNavigationProps> = ({ previousTopic, nextTopic }) => {
  return (
    <div className="mt-20 flex align-middle justify-center flex-row flex-wrap gap-4">
      {previousTopic && (
        <BluePillLink to={previousTopic.url}
        trackingData={{
          category: tracking.category.notfound,
          label: tracking.label.body,
          action: tracking.action.blue_pill,
        }}
      >
        {previousTopic.title}
      </BluePillLink>)}
      {nextTopic && (
      <RedPillLink
        to={nextTopic.url}
        trackingData={{
          category: tracking.category.notfound,
          label: tracking.label.body,
          action: tracking.action.red_pill,
        }}
      >
        {nextTopic.title}
      </RedPillLink>)}
    </div>
  );
};
