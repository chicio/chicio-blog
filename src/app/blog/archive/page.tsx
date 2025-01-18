import {siteMetadata} from "@/types/site-metadata";
import {BlogGenericPostListPageTemplate} from "@/components/templates/blog-generic-post-list-page-template";
import {tracking} from "@/types/tracking";
import {getPosts} from "@/lib/posts";
import { JsonLd } from "@/components/website/jsond-ld";

export default async function BlogArchive() {
  const author = siteMetadata.author;
  const posts = getPosts();

  return (
      <>
      <BlogGenericPostListPageTemplate
          title={"Archive"}
          posts={posts}
          author={author}
          trackingCategory={tracking.category.blog_archive}
      />
      <JsonLd ogPageType="website" url={siteMetadata.siteUrl} imageUrl={siteMetadata.featuredImage} title={siteMetadata.title}/>
      </>
  );
}

