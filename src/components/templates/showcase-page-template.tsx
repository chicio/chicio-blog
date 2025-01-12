import {FC, ReactElement, ReactNode} from "react";
import {siteMetadata} from "@/types/site-metadata";
import {ContainerFullscreen} from "@/components/design-system/atoms/container-fullscreen";
import {DownArrow} from "@/components/design-system/molecules/down-arrow";
import {Footer} from "@/components/design-system/organism/footer";

interface ShowcasePageProps {
  fullScreenComponent: ReactElement;
  trackingCategory: string;
  children?: ReactNode;
}

export const ShowcasePageTemplate: FC<ShowcasePageProps> = ({
  fullScreenComponent,
  trackingCategory,
  children,
}) => {
  const author = siteMetadata.author;

  return (
      <>
          <ContainerFullscreen>
            {fullScreenComponent}
            <DownArrow />
          </ContainerFullscreen>
          {children}
          <Footer author={author} trackingCategory={trackingCategory} />
      </>
  );
};
