'use client'

import React, { FC, useState } from "react";
import styled, { css } from "styled-components";
import { Container } from "../atoms/container";
import { HamburgerMenu } from "../molecules/hamburger-menu";
import { Overlay } from "../atoms/overlay";
import { Close } from "../molecules/close";
import { mediaQuery } from "../utils/media-query";
import { ScrollDirection, useScrollDirection } from "../hooks/use-scroll-direction";
import { MatrixMenuItem } from "../molecules/matrix-menu-item";
import { tracking } from "@/types/tracking";
import { slugs } from "@/types/slug";
import { usePathname } from "next/navigation";
import { SearchBox, SearchHits } from "@/components/design-system/molecules/search";
import { useSearch } from "@/components/design-system/hooks/use-search";
import { glassmorphism } from "../atoms/glassmorphism";

export const menuHeightNumber = 55;
export const menuHeight = `${menuHeightNumber}px`;

const MenuContainer = styled(Container)<{
  $shouldHide: boolean;
  $shouldOpenMenu: boolean;
  $delayOpenCloseMenuAnimation: number;
}>`
  position: fixed;
  top: ${(props) => (props.$shouldHide ? `-${menuHeight}` : 0)};
  padding: 0;
  left: 0;
  right: 0;
  transition: top 0.3s ease 0s;
  width: 100%;
  z-index: 300;

  ${mediaQuery.minWidth.xs} {
    padding: 0 ${(props) => props.theme.spacing[2]};
  }
`;

const MenuGlassContent = styled.div<{
  $shouldOpenMenu: boolean;
  $delayOpenCloseMenuAnimation: number;
}>`
  ${glassmorphism};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: none;

  transition: height 0.3s ease ${(props) => `${props.$delayOpenCloseMenuAnimation}s`};
  height: ${(props) => (props.$shouldOpenMenu ? "310px" : menuHeight)};
  overflow: hidden;
  width: 100%;
  margin: 0 auto;
`;

const MenuButtonContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;

  ${mediaQuery.minWidth.xs} {
    display: none;
  }
`;

const NavBar = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: ${menuHeight};
  width: 100%;
  margin: 0;
  padding: 0 ${(props) => props.theme.spacing[2]};

  ${mediaQuery.minWidth.xs} {
    flex-direction: row;
    padding: 0 ${(props) => props.theme.spacing[4]};
  }
`;

const NavBarMenuItem = styled(MatrixMenuItem)<{ shouldOpenMenu: boolean }>`
  margin: 0;
  height: 40px; /* Altezza ridotta per dare più spazio a border e shadow */
  
  ${mediaQuery.minWidth.sm} {
    margin-top: 7px; 
    visibility: visible;
    opacity: 1;
    margin-right: ${(props) => props.theme.spacing[4]};
    margin-bottom: 8px;
  }

  ${(props) => !props.shouldOpenMenu && css`
    ${mediaQuery.maxWidth.xs} {
      display: none;
    }
  `}

  ${(props) => props.shouldOpenMenu && css`
    ${mediaQuery.maxWidth.sm} {
      display: flex;
      width: calc(100% - ${(props) => props.theme.spacing[8]});
      min-height: 48px; /* Altezza adeguata per il tocco mobile */
      margin: ${(props) => props.theme.spacing[1]} 0; /* Margin ridotto */
    }
  `}
`;

export interface MenuProps {
  trackingCategory: string;
}

export const Menu: FC<MenuProps> = ({ trackingCategory }) => {
  const pathname = usePathname()
  const direction = useScrollDirection();
  const [shouldOpenMenu, setShouldOpenMenu] = useState(false);
  const [startSearch, setStartSearch] = useState(false);
  const { handleSearch, results } = useSearch(startSearch);
  const shouldHideMenu = pathname === slugs.chat ? false : direction === ScrollDirection.down;

  return (
    <>
      <MenuContainer
        $shouldOpenMenu={shouldOpenMenu}
        $shouldHide={shouldHideMenu}
        $delayOpenCloseMenuAnimation={shouldOpenMenu ? 0 : 0.4}
      >
        <MenuGlassContent
          $shouldOpenMenu={shouldOpenMenu}
          $delayOpenCloseMenuAnimation={shouldOpenMenu ? 0 : 0.4}
        >
          <NavBar>
            <NavBarMenuItem
              variant="header"
              to={"/"}
              selected={pathname === "/"}
              trackingData={{
                action: tracking.action.open_home,
                category: trackingCategory,
                label: tracking.label.header,
              }}
              shouldOpenMenu={shouldOpenMenu}
              onClickCallback={() => setShouldOpenMenu(false)}
            >
              Home
            </NavBarMenuItem>
            <NavBarMenuItem
              variant="header"
              to={slugs.blog}
              selected={
                pathname.includes(slugs.blog) && pathname !== slugs.aboutMe
              }
              trackingData={{
                action: tracking.action.open_home,
                category: trackingCategory,
                label: tracking.label.header,
              }}
              shouldOpenMenu={shouldOpenMenu}
              onClickCallback={() => setShouldOpenMenu(false)}
            >
              Blog
            </NavBarMenuItem>
            <NavBarMenuItem
              variant="header"
              to={slugs.art}
              selected={pathname === slugs.art}
              trackingData={{
                action: tracking.action.open_art,
                category: trackingCategory,
                label: tracking.label.header,
              }}
              shouldOpenMenu={shouldOpenMenu}
              onClickCallback={() => setShouldOpenMenu(false)}
            >
              Art
            </NavBarMenuItem>
            <NavBarMenuItem
              variant="header"
              to={slugs.aboutMe}
              selected={pathname === slugs.aboutMe}
              trackingData={{
                action: tracking.action.open_about_me,
                category: trackingCategory,
                label: tracking.label.header,
              }}
              shouldOpenMenu={shouldOpenMenu}
              onClickCallback={() => setShouldOpenMenu(false)}
            >
              About me
            </NavBarMenuItem>
            <NavBarMenuItem
              variant="header"
              to={slugs.chat}
              selected={pathname === slugs.chat}
              trackingData={{
                action: tracking.action.open_chat,
                category: trackingCategory,
                label: tracking.label.header,
              }}
              shouldOpenMenu={shouldOpenMenu}
              onClickCallback={() => setShouldOpenMenu(false)}
            >
              Chat
            </NavBarMenuItem>
            {!startSearch && (
              <MenuButtonContainer>
                {!shouldOpenMenu && (
                  <HamburgerMenu
                    onClick={() => {
                      if (!startSearch) {
                        setShouldOpenMenu(!shouldOpenMenu);
                      }
                    }}
                  />
                )}
                {shouldOpenMenu && (
                  <Close onClick={() => setShouldOpenMenu(!shouldOpenMenu)} />
                )}
              </MenuButtonContainer>
            )}
            {!shouldOpenMenu && (
              <SearchBox
                startSearch={startSearch}
                onClick={() => setStartSearch(!startSearch)}
                onChange={handleSearch}
              />
            )}
          </NavBar>
        </MenuGlassContent>
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
        >
          {results.length > 0 && <SearchHits results={results} />}
        </Overlay>
      )}
    </>
  );
};
