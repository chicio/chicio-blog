import {FC, ReactNode} from "react";
import {Menu} from "@/components/design-system/organism/menu";
import {ContentContainer} from "@/components/website/content-container";
import {DesktopBlogHeader} from "@/components/design-system/organism/blog-header";
import {Footer} from "@/components/design-system/organism/footer";

export interface PageProps {
  author: string;
  trackingCategory: string;
  big?: boolean;
  children?: ReactNode;
}

export const PageTemplate: FC<PageProps> = ({
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
        <DesktopBlogHeader big={big} />
        {children}
      </ContentContainer>
      <Footer author={author} trackingCategory={trackingCategory} />
    </>
);
