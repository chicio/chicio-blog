import { PaginationNavigation } from "@/components/design-system/molecules/buttons/pagination-navigation";
import { ContentPageTemplate } from "@/components/design-system/templates/content-page-template";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
import { FC } from "react";
import { PostCard } from "./post-card";
import { PostsRow } from "./posts-row";
import { Pagination } from "@/types/pagination";

interface BlogHomeProps {
  pagination: Pagination;
  author: string;
}

export const BlogHomePageContent: FC<BlogHomeProps> = ({ pagination, author }) => {
  const { launchPost, postsGrouped, previousPageUrl, nextPageUrl } = pagination;

  return (
    <>
      <ContentPageTemplate
        author={author}
        trackingCategory={tracking.category.blog_home}
        big={true}
      >
        <PostCard
          big={true}
          key={launchPost.frontmatter.slug.formatted}
          slug={launchPost.frontmatter.slug.formatted}
          title={launchPost.frontmatter.title}
          image={launchPost.frontmatter.image}
          authors={launchPost.frontmatter.authors}
          date={launchPost.frontmatter.date.formatted}
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
      </ContentPageTemplate>
      <JsonLd
        ogPageType="website"
        url={siteMetadata.siteUrl}
        imageUrl={siteMetadata.featuredImage}
        title={siteMetadata.title}
      />
    </>
  );
};
