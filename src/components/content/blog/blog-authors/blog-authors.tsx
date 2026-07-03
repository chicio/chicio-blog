"use client";

import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { FilterInput } from "@/components/design-system/molecules/form/filter-input";
import { JsonLd } from "@/components/features/seo/jsond-ld";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { ContentPage } from "@/components/features/content/content-page";
import { FC } from "react";
import { AuthorSummary } from "@/types/content/author";
import { AuthorCard } from "./author-card";
import { useBlogAuthorsStore } from "./use-blog-authors-store";

interface BlogAuthorsProps {
    author: string;
    authors: AuthorSummary[];
}

export const BlogAuthors: FC<BlogAuthorsProps> = ({ author, authors }) => {
    const { state, effects } = useBlogAuthorsStore(authors);
    const { query, filteredAuthors } = state;
    const { handleFilter } = effects;

    return (
        <>
            <ContentPage
                author={author}
                trackingCategory={tracking.category.blog_authors}
            >
                <div className="container-fluid p-0 mb-5">
                    <PageTitle>Authors</PageTitle>
                    <FilterInput
                        value={query}
                        onChange={handleFilter}
                        placeholder="Filter authors..."
                    />
                    {filteredAuthors.length > 0 ? (
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredAuthors.map((entry) => (
                                <AuthorCard
                                    key={entry.author.id}
                                    author={entry.author}
                                    postCount={entry.postCount}
                                    href={entry.slug}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-secondary flex flex-col items-center gap-3 py-16">
                            <p className="text-accent text-shadow-lg">No authors found for &ldquo;{query}&rdquo;.</p>
                        </div>
                    )}
                </div>
            </ContentPage>
            <JsonLd
                type="Blog"
                url={siteMetadata.siteUrl}
                imageUrl={siteMetadata.featuredImage}
                title={siteMetadata.title}
                keywords={authors.map((entry) => entry.author.name)}
            />
        </>
    );
};
