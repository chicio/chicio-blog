import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { ReadingContentPage } from "@/components/features/content/reading-content-page";
import { BreadcrumbItem } from "@/components/design-system/molecules/breadcrumbs/breadcrumb";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { FC, PropsWithChildren } from "react";
import { CourseNavigation } from "@/components/content/data-structures-and-algorithms/course-navigation";
import { JsonLd } from "@/components/features/seo/jsond-ld";
import { Content } from "@/types/content/content";

interface DsaProps {
    topic: Content;
    previousTopic?: Content;
    nextTopic?: Content;
}

export const Topic: FC<PropsWithChildren<DsaProps>> = async ({ topic, previousTopic, nextTopic }) => {
    const { contentFileRelativePath } = topic;
    const { default: TopicContent } = await import(`@/content/${contentFileRelativePath}/content.mdx`);

    return (
        <ReadingContentPage
            author={siteMetadata.author}
            breadcrumbs={[
                {
                    label: "DSA",
                    href: slugs.dataStructuresAndAlgorithms.roadmap,
                    isCurrent: false,
                },
                { label: topic.frontmatter.title, href: topic.slug.formatted, isCurrent: true },
            ] satisfies BreadcrumbItem[]}
        >
            <TopicContent />
            {(previousTopic || nextTopic) && (
                <CourseNavigation previousTopic={previousTopic} nextTopic={nextTopic} />
            )}
            <JsonLd
                type="BlogPosting"
                url={`${siteMetadata.siteUrl}${topic.slug.formatted}`}
                imageUrl={siteMetadata.featuredImage}
                title={topic.frontmatter.title}
                description={siteMetadata.description}
                keywords={topic.frontmatter.tags}
            />
        </ReadingContentPage>
    );
};
