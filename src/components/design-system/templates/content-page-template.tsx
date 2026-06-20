import { PageTemplate } from "@/components/design-system/templates/page-template";
import { BrandHeader } from "@/components/design-system/organism/header/brand-header";
import { FC, PropsWithChildren, ReactNode } from "react";

export interface ContentPageProps {
  author: string;
  trackingCategory: string;
  big?: boolean;
  headerWrapper?: FC<PropsWithChildren>;
  children?: ReactNode;
}

export const ContentPageTemplate: FC<ContentPageProps> = ({
  children,
  author,
  trackingCategory,
  big = false,
  headerWrapper,
}) => (
  <PageTemplate
    author={author}
    trackingCategory={trackingCategory}
    header={<BrandHeader big={big} wrapper={headerWrapper} />}
  >
    {children}
  </PageTemplate>
);
