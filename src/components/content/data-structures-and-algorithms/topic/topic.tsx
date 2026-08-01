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
import { isTableOfContentsViable } from "@/lib/content/heading-viability";
import { extractHeadings } from "@/lib/content/headings";

interface DsaProps {
    topic: Content;
    previous?: Content;
    next?: Content;
}

export const Topic: FC<PropsWithChildren<DsaProps>> = async ({ topic, previous, next }) => {
    const { contentFileRelativePath } = topic;
    const { default: TopicContent } = await import(`@/content/${contentFileRelativePath}/content.mdx`);
    const headings = extractHeadings(topic.content);

    return (
        <ReadingContentPage
            author={siteMetadata.author}
            headings={isTableOfContentsViable(headings) ? headings : undefined}
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
            {(previous || next) && <CourseNavigation previousTopic={previous} nextTopic={next} />}
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
