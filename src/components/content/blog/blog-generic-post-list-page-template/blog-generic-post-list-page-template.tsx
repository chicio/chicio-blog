import { InternalLink } from "@/components/design-system/atoms/links/internal-link";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { Content } from "@/types/content/content";
import { FC, ReactNode } from "react";
import { ContentPage } from "@/components/features/content/content-page";
import { JsonLd } from "@/components/features/seo/jsond-ld";
import { siteMetadata } from "@/types/configuration/site-metadata";

export interface BlogGenericPostListPageProps {
    title: string;
    posts: Content[];
    author: string;
    trackingCategory: string;
    keywords?: string[];
    beforeContent?: ReactNode;
}

export const BlogGenericPostListPageTemplate: FC<BlogGenericPostListPageProps> = ({
    title,
    posts,
    author,
    trackingCategory,
    keywords,
    beforeContent,
}) => (
    <ContentPage author={author} trackingCategory={trackingCategory}>
        {beforeContent}
        <PageTitle>{title}</PageTitle>
        {posts.map((post) => (
            <div
                className="container-fluid mb-4 flex flex-col items-start px-0 md:flex-row md:items-center"
                key={post.slug.formatted}
            >
                <div className="flex-1/6">
                    <time className="text-xl">{post.frontmatter.date.formatted}</time>
                </div>
                <div className="flex-5/6">
                    <InternalLink
                        className="text-xl"
                        to={post.slug.formatted}
                    >
                        {post.frontmatter.title}
                    </InternalLink>
                </div>
            </div>
        ))}
        <JsonLd
            type="Blog"
            url={siteMetadata.siteUrl}
            imageUrl={siteMetadata.featuredImage}
            title={siteMetadata.title}
            keywords={keywords}
        />
    </ContentPage>
);
