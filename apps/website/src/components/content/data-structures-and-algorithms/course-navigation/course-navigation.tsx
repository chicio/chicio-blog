import { BluePillLink, RedPillLink } from "@/components/features/design-system-next/pills-links";
import { Content } from "@/types/content/content";
import { FC } from "react";

interface CourseNavigationProps {
    previousTopic?: Content;
    nextTopic?: Content;
}

export const CourseNavigation: FC<CourseNavigationProps> = ({ previousTopic, nextTopic }) => {
    return (
        <div className="mt-20 flex flex-row flex-wrap justify-center gap-4 align-middle">
            {previousTopic && (
                <BluePillLink to={previousTopic.slug.formatted}>{previousTopic.frontmatter.title}</BluePillLink>
            )}
            {nextTopic && <RedPillLink to={nextTopic.slug.formatted}>{nextTopic.frontmatter.title}</RedPillLink>}
        </div>
    );
};
