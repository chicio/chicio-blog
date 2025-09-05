import { FC, ReactNode } from "react";
import {TrackingElementProps} from "@/types/tracking";
import {trackWith} from "@/lib/tracking/tracking";

type CallToActionExternalWithTrackingProps = TrackingElementProps & {
  href: string;
  className?: string;
  target?: string;
  rel?: string;
  children?: ReactNode;
};

export const CallToActionExternalWithTracking: FC<CallToActionExternalWithTrackingProps> =
  ({ children, className, href, trackingData, target, rel }) => (
    <a  
      className={`call-to-action${className ? ` ${className}` : ""}`}
      href={href}
      onClick={() => {
        trackWith(trackingData);
      }}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  );
