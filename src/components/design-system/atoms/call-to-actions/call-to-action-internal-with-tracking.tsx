'use client'

import { FC, ReactNode } from "react";
import {TrackingElementProps} from "@/types/tracking";
import {CallToActionInternal} from "@/components/design-system/atoms/call-to-actions/call-to-action-internal";
import {trackWith} from "@/lib/tracking/tracking";

type CallToActionInternalWithTrackingProps = TrackingElementProps & {
  to: string;
  className?: string;
  children?: ReactNode;
};

export const CallToActionInternalWithTracking: FC<CallToActionInternalWithTrackingProps> =
  ({ children, className, to, trackingData }) => (
    <CallToActionInternal
      className={className}
      href={to}
      onClick={() => {
        trackWith(trackingData);
      }}
    >
      {children}
    </CallToActionInternal>
  );
