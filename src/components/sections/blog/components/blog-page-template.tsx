import { FC, ReactNode } from "react";
import { Menu } from "@/components/design-system/organism/menu";
import { BlogContentContainer, ContentContainer } from "@/components/design-system/molecules/content-container";
import { BlogHeader } from "@/components/sections/blog/components/blog-header";
import { Footer } from "@/components/design-system/organism/footer";

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
  <>
    <Menu
      trackingCategory={trackingCategory}
    />
    <ContentContainer>
      <BlogHeader big={big} />
      <BlogContentContainer>
        {children}
      </BlogContentContainer>
    </ContentContainer>
    <Footer author={author} trackingCategory={trackingCategory} />
  </>
);
