import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { ContentPageTemplate } from "../../../design-system/templates/content-page-template";
import { FC } from "react";
import { Tag } from "@/types/content/post";
import { Tag as TagItem } from "@/components/design-system/molecules/buttons/tag";

interface BlogTagsProps {
  author: string;
  tags: Tag[];
}

export const BlogTags: FC<BlogTagsProps> = ({ tags, author }) => {
  return (
    <>
      <ContentPageTemplate
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
      </ContentPageTemplate>
      <JsonLd
        type="Blog"
        url={siteMetadata.siteUrl}
        imageUrl={siteMetadata.featuredImage}
        title={siteMetadata.title}
        keywords={tags.map((tag) => tag.tagValue)}
      />
    </>
  );
};
