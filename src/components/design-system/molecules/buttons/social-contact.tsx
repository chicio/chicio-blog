import { CallToActionExternalWithTracking } from "@/components/design-system/atoms/call-to-actions/call-to-action-external-with-tracking";
import { FC, ReactElement } from "react";

export interface SocialContactProps {
  link: string;
  trackingAction: string;
  trackingCategory: string;
  trackingLabel: string;
  icon: ReactElement;
}

export const SocialContact: FC<SocialContactProps> = ({
  link,
  trackingAction,
  trackingCategory,
  trackingLabel,
  icon,
}) => (
  <CallToActionExternalWithTracking
    className="min-w-auto"
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
  </CallToActionExternalWithTracking>
);
