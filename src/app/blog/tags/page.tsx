import {getTags} from "@/lib/posts";
import {siteMetadata} from "@/types/site-metadata";
import {BlogPageTemplate} from "@/components/templates/blog-page-template";
import {tracking} from "@/types/tracking";
import {TagsContainer} from "@/components/website/tags-container";
import {PageTitle} from "@/components/design-system/molecules/page-title";
import {Tag} from "@/components/design-system/molecules/tag";

export default async function Tags() {
    const tags = await getTags();
    const author = siteMetadata.author;

    return (
        <BlogPageTemplate
            author={author}
            trackingCategory={tracking.category.blog_tags}>
            <TagsContainer>
                <PageTitle>Tags</PageTitle>
                {tags.map((tag) => (
                    <Tag
                        big={true}
                        link={""}
                        tag={`${tag.tagValue} (${tag.count})`}
                        key={tag!.tagValue}
                        trackingCategory={tracking.category.blog_tags}
                        trackingLabel={tracking.label.body}
                    />
                ))}
            </TagsContainer>
        </BlogPageTemplate>
    );
}
