import {FC, ReactNode} from "react";
import {BlogMenu} from "@/components/design-system/organism/blog-menu";
import {ContentContainer} from "@/components/website/ContentContainer";
import {DesktopBlogHeader} from "@/components/design-system/organism/blog-header";
import {Footer} from "@/components/design-system/organism/footer";

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
