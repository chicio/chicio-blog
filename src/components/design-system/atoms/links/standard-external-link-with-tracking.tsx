import { FC, ReactNode } from "react";
import {TrackingElementProps} from "@/types/tracking";
import {StandardExternalLink} from "@/components/design-system/atoms/links/standard-external-link";
import {trackWith} from "@/lib/tracking/tracking";

type StandardExternalLinkWithTrackingProps = TrackingElementProps & {
  href: string;
  target?: string;
  rel?: string;
  children?: ReactNode;
};

export const StandardExternalLinkWithTracking: FC<
  StandardExternalLinkWithTrackingProps
> = ({ children, href, trackingData, target, rel }) => (
  <StandardExternalLink
    href={href}
    onClick={() => {
      trackWith(trackingData);
    }}
    target={target}
    rel={rel}
  >
    {children}
  </StandardExternalLink>
);
