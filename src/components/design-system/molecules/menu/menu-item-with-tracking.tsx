import { FC, ReactNode } from "react";
import {TrackingElementProps} from "@/types/tracking";
import {trackWith} from "@/lib/tracking/tracking";
import { MenuItem } from "./menu-item";

type MenuItemWithTrackingProps = TrackingElementProps & {
  to: string;
  selected: boolean;
  children?: ReactNode;
  onClickCallback?: () => void;
};

export const MenuItemWithTracking: FC<MenuItemWithTrackingProps> = ({
  children,
  to,
  trackingData,
  selected,
  onClickCallback,
}) => (
  <MenuItem
    to={to}
    // href={to}
    onClick={() => {
      trackWith(trackingData);
      onClickCallback?.();
    }}
    selected={selected}
  >
    {children}
  </MenuItem>
);
