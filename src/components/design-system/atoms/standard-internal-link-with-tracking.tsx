import { FC, ReactNode } from "react";
import {TrackingElementProps} from "@/types/tracking";
import {StandardInternalLink} from "@/components/design-system/atoms/standard-internal-link";
import {trackWith} from "@/lib/tracking";

type StandardInternalLinkWithTrackingProps = TrackingElementProps & {
  to: string;
  className?: string;
  children?: ReactNode;
};

export const StandardInternalLinkWithTracking: FC<
  StandardInternalLinkWithTrackingProps
> = ({ children, className, to, trackingData }) => (
  <StandardInternalLink
    className={className}
    href={to}
    onClick={() => {
      trackWith(trackingData);
    }}
  >
    {children}
  </StandardInternalLink>
);
