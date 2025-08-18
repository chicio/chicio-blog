import { FC, ReactNode } from "react";
import {TrackingElementProps} from "@/types/tracking";
import {MenuItem} from "@/components/design-system/molecules/menu-item";
import {trackWith} from "@/lib/tracking/tracking";

type MenuItemWithTrackingProps = TrackingElementProps & {
  to: string;
  className?: string;
  selected: boolean;
  children?: ReactNode;
  onClickCallback?: () => void;
};

export const MenuItemWithTracking: FC<MenuItemWithTrackingProps> = ({
  children,
  className,
  to,
  trackingData,
  selected,
  onClickCallback,
}) => (
  <MenuItem
    className={className}
    href={to}
    onClick={() => {
      trackWith(trackingData);
      onClickCallback?.();
    }}
    selected={selected}
  >
    {children}
  </MenuItem>
);
