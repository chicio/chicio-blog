import { PageTemplate } from "@/components/design-system/templates/page-template";
import { BlogHeader } from "@/components/sections/blog/components/blog-header";
import { FC, ReactNode } from "react";

export interface BlogPageProps {
  author: string;
  trackingCategory: string;
  big?: boolean;
  children?: ReactNode;
}

export const BlogPageTemplate: FC<BlogPageProps> = ({
  children,
  author,
  trackingCategory,
  big = false,
}) => (
  <PageTemplate
    author={author}
    trackingCategory={trackingCategory}
    header={
      <div>
        <BlogHeader big={big} />
      </div>
    }
  >
    {children}
  </PageTemplate>
);
