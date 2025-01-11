import { FC, ReactNode } from "react";
import {TrackingElementProps} from "@/types/tracking";
import {CallToActionExternal} from "@/components/design-system/atoms/call-to-action-external";
import {trackWith} from "@/lib/tracking";

type CallToActionExternalWithTrackingProps = TrackingElementProps & {
  href: string;
  className?: string;
  target?: string;
  rel?: string;
  children?: ReactNode;
};

export const CallToActionExternalWithTracking: FC<CallToActionExternalWithTrackingProps> =
  ({ children, className, href, trackingData, target, rel }) => (
    <CallToActionExternal
      className={className}
      href={href}
      onClick={() => {
        trackWith(trackingData);
      }}
      target={target}
      rel={rel}
    >
      {children}
    </CallToActionExternal>
  );
