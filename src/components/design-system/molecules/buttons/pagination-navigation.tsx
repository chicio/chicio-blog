'use client'

import styled from "styled-components";
import { FC } from "react";
import {tracking} from "@/types/tracking";
import { BluePillLink, RedPillLink } from "../links/pills-links";

const CenterHorizontallyContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${(props) => props.theme.spacing[4]};
  padding: ${(props) => props.theme.spacing[4]};
`;

export interface PageNavigationProps {
  trackingCategory: string;
  previousPageUrl: string | undefined;
  previousPageTrackingAction: string;
  nextPageUrl: string | undefined;
  nextPageTrackingAction: string;
}

export const PaginationNavigation: FC<PageNavigationProps> = ({
  trackingCategory,
  previousPageUrl,
  previousPageTrackingAction,
  nextPageUrl,
  nextPageTrackingAction,
}) => (
  <CenterHorizontallyContainer>
    {previousPageUrl && (
      <BluePillLink
        to={previousPageUrl}
        trackingData={{
          category: trackingCategory,
          label: tracking.label.body,
          action: previousPageTrackingAction,
        }}
      >
        Previous
      </BluePillLink>
    )}
    {nextPageUrl && (
      <RedPillLink
        to={nextPageUrl}
        trackingData={{
          category: trackingCategory,
          label: tracking.label.body,
          action: nextPageTrackingAction,
        }}
      >
        Next
      </RedPillLink>
    )}
  </CenterHorizontallyContainer>
);
