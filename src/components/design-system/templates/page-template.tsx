import {
    ContentContainer,
} from "@/components/design-system/molecules/containers/content-container";
import Footer from "@/components/design-system/organism/footer";
import { Menu } from "@/components/design-system/organism/menu";
import { FC, ReactNode } from "react";

export interface BlogPageProps {
  header: React.ReactElement;
  author: string;
  trackingCategory: string;
  children?: ReactNode;
}

export const PageTemplate: FC<BlogPageProps> = ({
  header,
  children,
  author,
  trackingCategory,
}) => (
  <>
    <Menu trackingCategory={trackingCategory} />
    <ContentContainer>
      {header}
      <div className="mt-4">{children}</div>
    </ContentContainer>
    <Footer author={author} trackingCategory={trackingCategory} />
  </>
);
