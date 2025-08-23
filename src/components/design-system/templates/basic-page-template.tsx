import { FC, ReactNode } from "react";
import { Menu } from "@/components/design-system/organism/menu";
import { ContentContainer } from "@/components/design-system/molecules/containers/content-container";

export interface BasicPageProps {
  trackingCategory: string;
  children?: ReactNode;
}

export const BasicPageTemplate: FC<BasicPageProps> = ({
  children,
  trackingCategory,
}) => (
  <>
    <Menu trackingCategory={trackingCategory} />
    <ContentContainer>{children}</ContentContainer>
  </>
);
