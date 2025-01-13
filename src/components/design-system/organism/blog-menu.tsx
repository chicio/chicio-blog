'use client'

import {FC, memo, useState} from "react";
import styled, { css } from "styled-components";
import { Container } from "../atoms/container";
import { HamburgerMenu } from "../molecules/hamburger-menu";
import { Overlay } from "../atoms/overlay";
import { Close } from "../molecules/close";
import { mediaQuery } from "../utils-css/media-query";
import { MobileBlogHeader } from "./blog-header";
import { ContainerFluid } from "../atoms/container-fluid";
import {
  ScrollDirection,
  useScrollDirection,
} from "../hooks/use-scroll-direction";
import {MenuItemWithTracking} from "@/components/design-system/atoms/menu-item-with-tracking";
import {tracking} from "@/types/tracking";
import {slugs} from "@/types/slug";
import {usePathname} from "next/navigation";

export const menuHeight = "55px";

const MobileBlogHeaderContainer = styled(ContainerFluid)<{ $hide: boolean }>`
  height: ${menuHeight};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: opacity 0.2s ease ${(props) => (props.$hide ? "0s" : "0.4s")};
  opacity: ${(props) => (props.$hide ? 0 : 1)};

  ${mediaQuery.minWidth.sm} {
    display: none;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${(props) => props.theme.light.textAbovePrimaryColor};
  position: absolute;
  top: 55px;
  left: ${(props) => props.theme.spacing[3]};
  right: ${(props) => props.theme.spacing[3]};
  opacity: 0.2;

  ${mediaQuery.dark} {
    background-color: ${(props) => props.theme.dark.textAbovePrimaryColor};
  }
`;

const MenuButtonContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;

  ${mediaQuery.minWidth.sm} {
    display: none;
  }
`;

const MenuContainer = styled.div<{
  $shouldHide: boolean;
  $shouldOpenMenu: boolean;
  $delayOpenCloseMenuAnimation: number;
}>`
  background-color: ${(props) => props.theme.light.primaryColorDark};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  position: fixed;
  top: ${(props) => (props.$shouldHide ? `-${menuHeight}` : 0)};
  left: 0;
  right: 0;
  transition:
    top 0.3s ease 0s,
    height 0.3s ease ${(props) => `${props.$delayOpenCloseMenuAnimation}s`};
  width: 100%;
  z-index: 300;
  height: ${(props) => (props.$shouldOpenMenu ? "260px" : menuHeight)};
  overflow: hidden;

  ${mediaQuery.dark} {
    background-color: ${(props) => props.theme.dark.primaryColorDark};
  }
`;

const NavBar = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: ${menuHeight};

  ${mediaQuery.minWidth.sm} {
    flex-direction: row;
  }
`;

interface NavBarMenuItemProps {
  shouldOpenMenu: boolean;
}

const NavBarMenuItem = memo(styled(MenuItemWithTracking)<NavBarMenuItemProps>`
  position: relative;
  display: inline-block;
  margin-right: 20px;
  line-height: 50px;
  font-size: ${(props) => props.theme.fontSizes[5]};
  height: auto;

  ${mediaQuery.minWidth.sm} {
    visibility: visible;
    opacity: 1;
    height: ${menuHeight};

    ${(props) =>
      !props.selected &&
      css`
        ${mediaQuery.inputDevice.mouse} {
          transition: transform 0.15s;
        }
      `};
  }
`);

export interface MenuProps {
  trackingCategory: string;
}

export const BlogMenu: FC<MenuProps> = ({ trackingCategory }) => {
  const pathname = usePathname()
  const direction = useScrollDirection();
  const [shouldOpenMenu, setShouldOpenMenu] = useState(false);
  const [startSearch, setStartSearch] = useState(false);

  return (
    <>
      <MenuContainer
        $shouldOpenMenu={shouldOpenMenu}
        $shouldHide={direction === ScrollDirection.down}
        $delayOpenCloseMenuAnimation={shouldOpenMenu ? 0 : 0.4}
      >
        <NavBar>
          <MobileBlogHeaderContainer $hide={startSearch}>
            <MobileBlogHeader height={menuHeight} />
            <Divider />
          </MobileBlogHeaderContainer>
          <NavBarMenuItem
            to={"/"}
            selected={pathname === "/"}
            trackingData={{
              action: tracking.action.open_home,
              category: trackingCategory,
              label: tracking.label.header,
            }}
            shouldOpenMenu={shouldOpenMenu}
          >
            Home
          </NavBarMenuItem>
          <NavBarMenuItem
              to={slugs.blog}
              selected={pathname === slugs.blog}
              trackingData={{
                action: tracking.action.open_home,
                category: trackingCategory,
                label: tracking.label.header,
              }}
              shouldOpenMenu={shouldOpenMenu}
          >
            Blog
          </NavBarMenuItem>
          <NavBarMenuItem
              to={slugs.art}
              selected={pathname === slugs.art}
              trackingData={{
                action: tracking.action.open_art,
                category: trackingCategory,
                label: tracking.label.header,
              }}
              shouldOpenMenu={shouldOpenMenu}
          >
            Art
          </NavBarMenuItem>
          <NavBarMenuItem
              to={slugs.aboutMe}
              selected={pathname === slugs.aboutMe}
              trackingData={{
                action: tracking.action.open_about_me,
                category: trackingCategory,
                label: tracking.label.header,
              }}
              shouldOpenMenu={shouldOpenMenu}
          >
            About me
          </NavBarMenuItem>
          {!startSearch && (
            <MenuButtonContainer>
              {!shouldOpenMenu && (
                <HamburgerMenu
                  onClick={() => {
                    if (!startSearch) {
                      setShouldOpenMenu(!shouldOpenMenu)
                    }
                  }}
                />
              )}
              {shouldOpenMenu && (
                <Close onClick={() => setShouldOpenMenu(!shouldOpenMenu)}/>
              )}
            </MenuButtonContainer>
          )}
          {!shouldOpenMenu && (
              /// TODO: MIGRATION MISSING
              // <Search startSearch={startSearch} setStartSearch={setStartSearch} />
              <div></div>
          )}
        </NavBar>
      </MenuContainer>
      {(shouldOpenMenu || startSearch) && (
        <Overlay
          zIndex={250}
          delay={"0.4s"}
          onClick={() => {
            if (shouldOpenMenu) {
              setShouldOpenMenu(false);
            }
            if (startSearch) {
              setStartSearch(false);
            }
          }}
        />
      )}
    </>
  );
};
