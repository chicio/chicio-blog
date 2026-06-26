import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { ReadingContentPage } from "@/components/features/content/reading-content-page";
import { BreadcrumbItem } from "@/components/design-system/molecules/breadcrumbs/breadcrumb";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { FC, PropsWithChildren } from "react";
import { JsonLd } from "@/components/features/seo/jsond-ld";
import { Content } from "@/types/content/content";

interface ExerciseProps {
    exercise: Content;
    topic: Content;
}

export const Exercise: FC<PropsWithChildren<ExerciseProps>> = async ({ exercise, topic }) => {
    const { contentFileRelativePath } = exercise;
    const { default: ExerciseContent } = await import(`@/content/${contentFileRelativePath}/content.mdx`);

    return (
        <ReadingContentPage
            author={siteMetadata.author}
            breadcrumbs={[
                {
                    label: "DSA",
                    href: slugs.dataStructuresAndAlgorithms.roadmap,
                    isCurrent: false,
                },
                {
                    label: topic.frontmatter.title,
                    href: topic.slug.formatted,
                    isCurrent: false,
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
        </ReadingContentPage>
    );
};
