import {siteMetadata} from "@/types/site-metadata";
import {BlogGenericPostListPageTemplate} from "@/components/templates/blog-generic-post-list-page-template";
import {tracking} from "@/types/tracking";
import {getPostsForTag} from "@/lib/posts";
import {NextTagParameters} from "@/types/page-parameters";

export default async function TagPage({ params }: NextTagParameters) {
    const { tag } = await params;
    const parsedTag = tag.replaceAll('-', ' ')
    const posts = getPostsForTag(parsedTag);
    const tagHeader = `${parsedTag} (${posts.length})`

    return (
        <BlogGenericPostListPageTemplate
            title={tagHeader}
            posts={posts}
            author={siteMetadata.author}
            trackingCategory={tracking.category.blog_tag}
        />
    );
}
