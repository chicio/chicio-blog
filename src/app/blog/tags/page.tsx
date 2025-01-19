import { getTags } from "@/lib/posts";
import { siteMetadata } from "@/types/site-metadata";
import { BlogPageTemplate } from "@/components/templates/blog-page-template";
import { tracking } from "@/types/tracking";
import { TagsContainer } from "@/components/website/tags-container";
import { PageTitle } from "@/components/design-system/molecules/page-title";
import { Tag } from "@/components/design-system/molecules/tag";
import { JsonLd } from "@/components/website/jsond-ld";
import { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { slugs } from "@/types/slug";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    author: siteMetadata.author,
    title: siteMetadata.title,
    url: `${siteMetadata.siteUrl}${slugs.tags}`,
    imageUrl: siteMetadata.featuredImage,
    ogPageType: "website",
  });
}

export default async function Tags() {
  const tags = getTags();
  const author = siteMetadata.author;

  return (
    <>
      <BlogPageTemplate
        author={author}
        trackingCategory={tracking.category.blog_tags}
      >
        <TagsContainer>
          <PageTitle>Tags</PageTitle>
          {tags.map((tag) => (
            <Tag
              big={true}
              link={tag.slug}
              tag={`${tag.tagValue} (${tag.count})`}
              key={tag!.tagValue}
              trackingCategory={tracking.category.blog_tags}
              trackingLabel={tracking.label.body}
            />
          ))}
        </TagsContainer>
      </BlogPageTemplate>
      <JsonLd
        ogPageType="website"
        url={siteMetadata.siteUrl}
        imageUrl={siteMetadata.featuredImage}
        title={siteMetadata.title}
      />
    </>
  );
}
