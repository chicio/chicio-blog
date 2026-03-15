import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { BreadcrumbItem } from "@/components/design-system/molecules/breadcrumbs/breadcrumb";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { tracking } from "@/types/configuration/tracking";
import { FC, PropsWithChildren } from "react";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { Content } from "@/types/content/content";

interface ExerciseProps {
    exercise: Content;
    topic: Content;
}

export const Exercise: FC<PropsWithChildren<ExerciseProps>> = async ({ exercise, topic }) => {
    const { contentFileRelativePath } = exercise;
    const { default: ExerciseContent } = await import(`@/content/${contentFileRelativePath}/content.mdx`);

    return (
        <ReadingContentPageTemplate
            author={siteMetadata.author}
            trackingCategory={tracking.category.data_structures_and_algorithms}
            breadcrumbs={[
                {
                    label: "DSA",
                    href: slugs.dataStructuresAndAlgorithms.roadmap,
                    isCurrent: false,
                    trackingData: {
                        action: tracking.action.open_dsa_roadmap,
                        category: tracking.category.data_structures_and_algorithms,
                        label: tracking.label.body,
                    },
                },
                {
                    label: topic.frontmatter.title,
                    href: topic.slug.formatted,
                    isCurrent: false,
                    trackingData: {
                        action: tracking.action.open_dsa_topic,
                        category: tracking.category.data_structures_and_algorithms,
                        label: tracking.label.body,
                    },
                },
                { label: exercise.frontmatter.title, href: exercise.slug.formatted, isCurrent: true },
            ] satisfies BreadcrumbItem[]}
        >
            <ExerciseContent />
            <JsonLd
                type="BlogPosting"
                url={`${siteMetadata.siteUrl}${exercise.slug.formatted}`}
                imageUrl={siteMetadata.featuredImage}
                title={exercise.frontmatter.title}
                description={siteMetadata.description}
                keywords={exercise.frontmatter.tags}
            />
        </ReadingContentPageTemplate>
    );
};
