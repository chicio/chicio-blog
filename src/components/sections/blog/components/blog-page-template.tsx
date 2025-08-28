import { PageTemplate } from "@/components/design-system/templates/page-template";
import { BrandHeader } from "@/components/design-system/organism/header/brand-header";
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
    header={<BrandHeader big={big} />}
  >
    {children}
  </PageTemplate>
);
