import {FC, ReactNode} from "react";
import {BlogMenu} from "@/components/design-system/organism/blog-menu";
import {ContentContainer} from "@/components/website/ContentContainer";
import {DesktopBlogHeader} from "@/components/design-system/organism/blog-header";
import {Footer} from "@/components/design-system/organism/footer";
import {OgPageType} from "@/lib/seo";

export interface BlogPageProps {
  author: string;
  ogPageType: OgPageType;
  ogImage: string;
  trackingCategory: string;
  customTitle?: string;
  description?: string;
  date?: string;
  big?: boolean;
  keywords?: ReadonlyArray<string | null>;
  children?: ReactNode;
}

export const BlogPageTemplate: FC<BlogPageProps> = ({
  children,
  author,
  ogPageType,
  ogImage,
  trackingCategory,
  customTitle,
  description,
  date,
  keywords,
  big = false,
}) => (
    <>
      <BlogMenu
        trackingCategory={trackingCategory}
      />
      <ContentContainer>
        <DesktopBlogHeader big={big} />
        {children}
      </ContentContainer>
      <Footer author={author} trackingCategory={trackingCategory} />
    </>
);
