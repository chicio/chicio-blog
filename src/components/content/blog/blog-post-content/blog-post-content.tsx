import { ReadingContentPage } from "@/components/features/content/reading-content-page";
import { BreadcrumbItem } from "@/components/design-system/molecules/breadcrumbs/breadcrumb";
import { JsonLd } from "@/components/features/seo/jsond-ld";
import { Content } from "@/types/content/content";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { tracking } from "@/types/configuration/tracking";
import { FC } from "react";
import { PostAuthors } from "@/components/content/blog/post-authors";
import { PostMeta } from "@/components/content/blog/post-meta";
import { PostTags } from "@/components/content/blog/post-tags";
import { ArchivedComments } from "@/components/content/blog/archived-comments";
import { BlogComments } from "@/components/content/blog/blog-comments";
import { RecentPosts } from "./read-next";
import { ChromeAiFeaturesToolbar } from "./chrome-ai-features-toolbar";

interface PostProps {
    post: Content;
}

export const BlogPostContent: FC<PostProps> = async ({ post }) => {
    const { frontmatter, readingTime, contentFileRelativePath } = post;
    const { default: PostContent } = await import(`@/content/${contentFileRelativePath}/content.mdx`);

    return (
        <>
            <ReadingContentPage
                author={siteMetadata.author}
                trackingCategory={tracking.category.blog_post}
                breadcrumbs={[
                    {
                        label: "Blog",
                        href: slugs.blog.home,
                        isCurrent: false,
                    },
                    { label: frontmatter.title, href: post.slug.formatted, isCurrent: true },
                ] satisfies BreadcrumbItem[]}
                beforeContent={
                    <>
                        <h1 className="leading-tight">{frontmatter.title}</h1>
                        <PostAuthors postAuthors={frontmatter.authors} />
                        <PostMeta
                            date={frontmatter.date.formatted}
                            readingTime={readingTime.text}
                        />
                        <ChromeAiFeaturesToolbar contentContainerId="reading-content-container" />
                    </>
                }
                afterContent={
                    <>
                        <PostTags tags={frontmatter.tags} />
                        <RecentPosts currentSlug={post.slug.formatted} />
                        <ArchivedComments slug={post.slug.params.slug} />
                        <BlogComments />
                    </>
                }
            >
                <PostContent />
            </ReadingContentPage>
            <JsonLd
                type="BlogPosting"
                url={`${siteMetadata.siteUrl}${post.slug.formatted}`}
                imageUrl={frontmatter.image}
                title={frontmatter.title}
                date={frontmatter.date}
                description={frontmatter.description}
                keywords={frontmatter.tags}
            />
        </>
    );
};
