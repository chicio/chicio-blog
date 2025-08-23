import { FC, ReactNode } from "react";
import {TrackingElementProps} from "@/types/tracking";
import {trackWith} from "@/lib/tracking/tracking";
import { MenuItem } from "./menu-item";

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
