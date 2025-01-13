import {getPostsPaginationFor} from "@/lib/posts";
import {NextPostPaginationParameters} from "@/types/post";
import {BlogPageTemplate} from "@/components/templates/blog-page-template";
import {siteMetadata} from "@/types/site-metadata";
import {tracking} from "@/types/tracking";
import {PostCard} from "@/components/design-system/molecules/post-card";
import {PaginationNavigation} from "@/components/design-system/molecules/pagination-navigation";
import {PostsRow} from "@/components/design-system/molecules/posts-row";
import {createMetadata} from "@/lib/seo";
import {slugs} from "@/types/slug";
import {Metadata} from "next";

export async function generateMetadata({ params }: NextPostPaginationParameters): Promise<Metadata> {
    const { page } = await params

    return createMetadata({
        author: siteMetadata.author,
        title: siteMetadata.title,
        url: `${siteMetadata.siteUrl}${slugs.blogPage}/${page}`,
        imageUrl: siteMetadata.featuredImage,
        ogPageType: 'website',
    })
}

export default async function BlogPage({ params }: NextPostPaginationParameters) {
    const { page } = await params
    const pageParam = parseInt(page || "1", 10);
    const {launchPost, postsGrouped, previousPageUrl, nextPageUrl} = getPostsPaginationFor(pageParam);
    const author = siteMetadata.author;
    const featuredImage = siteMetadata.featuredImage;

    return (
        <BlogPageTemplate
            author={author}
            ogImage={featuredImage}
            ogPageType={'website'}
            trackingCategory={tracking.category.blog_home}
            big={true}
        >
            <PostCard
                big={true}
                key={launchPost.frontmatter.slug}
                slug={launchPost.frontmatter.slug}
                title={launchPost.frontmatter.title}
                image={launchPost.frontmatter.image}
                authors={launchPost.frontmatter.authors}
                date={launchPost.frontmatter.date}
                readingTime={launchPost.readingTime.text!}
                description={launchPost.frontmatter.description}
                trackingCategory={tracking.category.blog_home}
                tags={launchPost.frontmatter.tags}
            />
            {postsGrouped.map((postsGroup, index) => (
                <PostsRow postsGroup={postsGroup} key={`PostCardsRow${index}`} />
            ))}
            <PaginationNavigation
                trackingCategory={tracking.category.blog_home}
                previousPageUrl={previousPageUrl}
                previousPageTrackingAction={tracking.action.open_blog_previous_page}
                nextPageUrl={nextPageUrl}
                nextPageTrackingAction={tracking.action.open_blog_next_page}
            />
        </BlogPageTemplate>
    );
}
