/// TODO: MIGRATION MISSING
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, ReactNode } from "react";
import {siteMetadata} from "@/types/site-metadata";
import {OgPageType} from "@/lib/seo";
import {ContainerFullscreen} from "@/components/design-system/atoms/container-fullscreen";
import {DownArrow} from "@/components/design-system/molecules/down-arrow";
import {Footer} from "@/components/design-system/organism/footer";

interface ShowcasePageProps {
  location: string;
  fullScreenComponent: React.ReactElement;
  trackingCategory: string;
  ogPageType: OgPageType;
  title?: string;
  featuredImage: string;
  cookieConsentColor: string;
  keywords?: ReadonlyArray<string | null>;
  children?: ReactNode;
}

export const ShowcasePageTemplate: FC<ShowcasePageProps> = ({
  children,
  location,
  fullScreenComponent,
  trackingCategory,
  ogPageType,
  title,
  featuredImage,
  cookieConsentColor,
  keywords,
}) => {
  const author = siteMetadata.author;

  return (
      <>
          {/*<Head*/}
          {/*  url={location.url}*/}
          {/*  pageType={ogPageType}*/}
          {/*  imageUrl={featuredImage}*/}
          {/*  customTitle={title}*/}
          {/*  cookieConsentColor={cookieConsentColor}*/}
          {/*  keywords={keywords}*/}
          {/*/>*/}
          <ContainerFullscreen>
            {fullScreenComponent}
            <DownArrow />
          </ContainerFullscreen>
          {children}
          <Footer author={author} trackingCategory={trackingCategory} />
      </>
  );
};
