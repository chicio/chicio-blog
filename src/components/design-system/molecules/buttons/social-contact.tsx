'use client'

import { CallToActionExternalWithTracking } from "@/components/design-system/atoms/call-to-actions/call-to-action-external-with-tracking";
import { FC, ReactElement } from "react";
import styled from "styled-components";

export interface SocialContactProps {
  link: string;
  trackingAction: string;
  trackingCategory: string;
  trackingLabel: string;
  icon: ReactElement;
}

const CallToActionBlock = styled(CallToActionExternalWithTracking)`
  display: block;
  min-width: auto;
`;

export const SocialContact: FC<SocialContactProps> = ({
  link,
  trackingAction,
  trackingCategory,
  trackingLabel,
  icon,
}) => (
  <CallToActionBlock
    href={link}
    trackingData={{
      action: trackingAction,
      category: trackingCategory,
      label: trackingLabel,
    }}
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </CallToActionBlock>
);
