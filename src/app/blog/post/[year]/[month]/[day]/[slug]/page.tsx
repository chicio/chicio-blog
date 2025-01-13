import 'katex/dist/katex.min.css';
import {getPostBy} from "@/lib/posts";
import {NextPostParameters} from "@/types/post";
import {siteMetadata} from "@/types/site-metadata";
import {tracking} from "@/types/tracking";
import {BlogPageTemplate} from "@/components/templates/blog-page-template";
import {Metadata} from "next";
import {createMetadata} from "@/lib/seo";
import {PostContainer, PostContent, PostTitle} from "@/components/website/post";
import {PostAuthors} from "@/components/design-system/molecules/post-authors";
import {PostMeta} from "@/components/design-system/molecules/post-meta";
import {PostTags} from "@/components/design-system/molecules/post-tags";
import {RecentPosts} from "@/components/design-system/organism/read-next";
import {Comments} from "@/components/design-system/molecules/comments";

export async function generateMetadata({ params }: NextPostParameters): Promise<Metadata> {
    const { year, month, day, slug } = await params;
    const { frontmatter } = getPostBy(year, month, day, slug);

    return createMetadata({
        author: siteMetadata.author,
        title: frontmatter.title,
        url: `${siteMetadata.siteUrl}${frontmatter.slug}`,
        imageUrl: frontmatter.image,
        description: frontmatter.description,
        ogPageType: 'article',
        keywords: frontmatter.tags
    })
}

export default async function BlogPost({ params }: NextPostParameters) {
    const { year, month, day, slug } = await params;
    const { frontmatter, content, readingTime } = getPostBy(year, month, day, slug);

    return (
        <BlogPageTemplate
            author={siteMetadata.author}
            trackingCategory={tracking.category.blog_post}
        >
            <PostContainer>
                <PostTitle className="blog-post-title">
                    {frontmatter.title}
                </PostTitle>
                <PostAuthors
                    postAuthors={frontmatter.authors}
                    trackingCategory={tracking.category.blog_post}
                    trackingLabel={tracking.label.body}
                    enableUrl={true}
                />
                <PostMeta
                    date={frontmatter.date}
                    readingTime={readingTime.text}
                />
                <PostContent html={content} />
                <PostTags
                    tags={frontmatter.tags}
                    trackingCategory={tracking.category.blog_post}
                    trackingLabel={tracking.label.body}
                />
            </PostContainer>
            <>
                <RecentPosts currentSlug={frontmatter.slug} />
                {frontmatter.comments && (
                    <Comments url={frontmatter.slug} title={frontmatter.title} />
                )}
            </>
        </BlogPageTemplate>
        // <article>
        //     <h1>{frontmatter.title}</h1>
        //     <h2>{frontmatter.authors[0].name}</h2>
        //     <h2>{frontmatter.date}</h2>
        //     <h2>{readingTime.text}</h2>
        //     <div dangerouslySetInnerHTML={{ __html: content }} />
        //     <div>{frontmatter.tags}</div>
        // </article>
    );
}
