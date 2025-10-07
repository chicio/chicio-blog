import { FC, ReactNode } from "react";
import { ContentProgressBar } from "../organism/reading-content-progress-bar";
import { ContentPageTemplate } from "./content-page-template";

export interface ContentPageProps {
  author: string;
  trackingCategory: string;
  big?: boolean;
  beforeContent?: ReactNode;
  children?: ReactNode;
  afterContent?: ReactNode;
}

const contentId = "reading-content-container";

export const ReadingContentPageTemplate: FC<ContentPageProps> = ({
  beforeContent,
  children,
  afterContent,
  author,
  trackingCategory,
  big = false,
}) => (
  <>
    <ContentProgressBar contentId={contentId} />
    <ContentPageTemplate
      author={author}
      trackingCategory={trackingCategory}
      big={big}
    >
      {beforeContent}
      <div id={contentId}>{children}</div>
      {afterContent}
    </ContentPageTemplate>
  </>
);
