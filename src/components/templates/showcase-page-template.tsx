import {FC, ReactElement, ReactNode} from "react";
import {siteMetadata} from "@/types/site-metadata";
import {OgPageType} from "@/lib/seo";
import {ContainerFullscreen} from "@/components/design-system/atoms/container-fullscreen";
import {DownArrow} from "@/components/design-system/molecules/down-arrow";
import {Footer} from "@/components/design-system/organism/footer";
import {SiteHead} from "@/components/website/SiteHead";

interface ShowcasePageProps {
  fullScreenComponent: ReactElement;
  trackingCategory: string;
  ogPageType: OgPageType;
  title?: string;
  featuredImage: string;
  keywords?: string[];
  children?: ReactNode;
}

export const ShowcasePageTemplate: FC<ShowcasePageProps> = ({
  children,
  fullScreenComponent,
  trackingCategory,
  ogPageType,
  title,
  featuredImage,
  keywords,
}) => {
  const author = siteMetadata.author;

  return (
      <>
          <SiteHead
            pageType={ogPageType}
            imageUrl={featuredImage}
            customTitle={title}
            keywords={keywords}
          />
          <ContainerFullscreen>
            {fullScreenComponent}
            <DownArrow />
          </ContainerFullscreen>
          {children}
          <Footer author={author} trackingCategory={trackingCategory} />
      </>
  );
};
