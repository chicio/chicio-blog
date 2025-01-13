'use client'

import styled from "styled-components";
import { FC } from "react";
import {tracking} from "@/types/tracking";
import {CallToActionInternalWithTracking} from "@/components/design-system/atoms/call-to-action-internal-with-tracking";

const CenterHorizontallyContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: ${(props) => props.theme.spacing[4]};
`;

const PageNavigationCallToAction = styled(CallToActionInternalWithTracking)`
  width: 100px;
  text-align: center;
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
      <PageNavigationCallToAction
        to={previousPageUrl}
        trackingData={{
          category: trackingCategory,
          label: tracking.label.body,
          action: previousPageTrackingAction,
        }}
      >
        Previous
      </PageNavigationCallToAction>
    )}
    {nextPageUrl && (
      <PageNavigationCallToAction
        to={nextPageUrl}
        trackingData={{
          category: trackingCategory,
          label: tracking.label.body,
          action: nextPageTrackingAction,
        }}
      >
        Next
      </PageNavigationCallToAction>
    )}
  </CenterHorizontallyContainer>
);
