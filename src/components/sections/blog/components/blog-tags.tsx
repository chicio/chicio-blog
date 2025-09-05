import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
import { BlogPageTemplate } from "./blog-page-template";
import { FC } from "react";
import { Tag } from "@/types/post";
import { Tag as TagItem } from "@/components/design-system/molecules/buttons/tag";

interface BlogTagsProps {
  author: string;
  tags: Tag[];
}

export const BlogTags: FC<BlogTagsProps> = ({ tags, author }) => {
  return (
    <>
      <BlogPageTemplate
        author={author}
        trackingCategory={tracking.category.blog_tags}
      >
        <div className="container-fluid p-0 mb-5">
          <PageTitle>Tags</PageTitle>
          {tags.map((tag) => (
            <TagItem
              big={true}
              link={tag.slug}
              tag={`${tag.tagValue} (${tag.count})`}
              key={tag!.tagValue}
              trackingCategory={tracking.category.blog_tags}
              trackingLabel={tracking.label.body}
            />
          ))}
        </div>
      </BlogPageTemplate>
      <JsonLd
        ogPageType="website"
        url={siteMetadata.siteUrl}
        imageUrl={siteMetadata.featuredImage}
        title={siteMetadata.title}
      />
    </>
  );
};
