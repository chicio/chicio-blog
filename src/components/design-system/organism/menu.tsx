'use client'

import { SearchBox, SearchHits } from "@/components/design-system/molecules/menu/search";
import { useSearch } from "@/components/design-system/utils/hooks/use-search";
import { slugs } from "@/types/slug";
import { tracking } from "@/types/tracking";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import styled from "styled-components";
import { Container } from "../atoms/containers/container";
import { glassmorphism } from "../atoms/effects/glassmorphism";
import { Overlay } from "../atoms/effects/overlay";
import { MatrixMenuItem } from "../molecules/menu/matrix-menu-item";
import { ScrollDirection, useScrollDirection } from "../utils/hooks/use-scroll-direction";
import { mediaQuery } from "../utils/media-query";
import { HamburgerMenu } from "../molecules/menu/hamburger-menu";
import { Close } from "../molecules/menu/close";

export const menuHeightNumber = 55;
export const menuHeight = `${menuHeightNumber}px`;

const menuVariants: Variants = {
  hidden: {
    y: -menuHeightNumber,
    transition: {
      type: "spring",
      duration: 0.3
    }
  },
  visible: {
    y: 0,
    transition: {
      type: "spring",
      duration: 0.3
    }
  }
};

// Animation variants for menu content expansion
const contentVariants: Variants = {
  collapsed: {
    height: menuHeightNumber,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      when: "afterChildren",
    }
  },
  expanded: {
    height: 370,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      when: "beforeChildren"
    }
  }
};

// Animation variants for navbar container with stagger control
const navBarVariants: Variants = {
  hidden: {
    transition: {
      staggerChildren: 0.5,
      staggerDirection: -1 // Last item disappears first when closing
    }
  },
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2 // Wait for height expansion to start
    }
  }
};

const MenuContainer = styled(motion(Container))<{
  $shouldHide: boolean;
  $shouldOpenMenu: boolean;
}>`
  position: fixed;
  padding: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 300;
  
  box-sizing: border-box;

  /* Compensazione scrollbar quando lo scroll è locked */
  body.scroll-locked & {
    right: var(--scrollbar-width, 0px);
  }

  ${mediaQuery.minWidth.xs} {
    padding-left: ${(props) => props.theme.spacing[2]};
    padding-right: ${(props) => props.theme.spacing[2]};
  }
`;

const MenuGlassContent = styled(motion.div)<{
  $shouldOpenMenu: boolean;
}>`
  ${glassmorphism};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: none;

  ${mediaQuery.maxWidth.xs} {
    border-right: none;
    border-left: none;
  }

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

const NavBar = styled(motion(Container))`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: ${menuHeight};
  width: 100%;
  margin: 0;
  padding: 0 ${(props) => props.theme.spacing[2]};

  ${mediaQuery.minWidth.xs} {
    flex-direction: row;
    padding: 0 ${(props) => props.theme.spacing[4]};
  }

  /* Su mobile: padding-top pari all'altezza dell'header quando menu chiuso */
  ${mediaQuery.maxWidth.xs} {
    padding-top: ${menuHeight};
  }
`;

const NavBarMenuItem = styled(MatrixMenuItem)`
  margin: 0;
  height: 40px;
  
  ${mediaQuery.minWidth.sm} {
    margin-top: 7px; 
    margin-right: ${(props) => props.theme.spacing[4]};
    margin-bottom: 8px;
  }

  ${mediaQuery.maxWidth.xs} {
    width: calc(100% - ${(props) => props.theme.spacing[8]});
    min-height: 48px;
    margin: ${(props) => props.theme.spacing[1]} 0;
  }

  ${mediaQuery.maxWidth.sm} {
      font-size: ${(props) => props.theme.fontSizes[1]};
  }
`;

export interface MenuProps {
  trackingCategory: string;
}

export const Menu: FC<MenuProps> = ({ trackingCategory }) => {
  const pathname = usePathname()
  const direction = useScrollDirection();
  const [shouldOpenMenu, setShouldOpenMenu] = useState(false);
  const [startSearch, setStartSearch] = useState(false);
  const { handleSearch, resetSearch, results } = useSearch(startSearch);
  const shouldHideMenu = pathname === slugs.chat ? false : direction === ScrollDirection.down;

  return (
    <>
      <MenuContainer
        $shouldOpenMenu={shouldOpenMenu}
        $shouldHide={shouldHideMenu}
        variants={menuVariants}
        animate={shouldHideMenu ? "hidden" : "visible"}
        initial="visible"
      >
        <MenuGlassContent
          $shouldOpenMenu={shouldOpenMenu}
          variants={contentVariants}
          animate={shouldOpenMenu ? "expanded" : "collapsed"}
          initial="collapsed"
        >
          <NavBar
            variants={navBarVariants}
            initial="hidden"
            animate={shouldOpenMenu ? "visible" : "hidden"}
          >
            {/* Desktop: sempre visibili, Mobile: nascosti con padding quando chiuso */}
            <NavBarMenuItem
              key="home"
              variant="header"
              to={"/"}
              selected={pathname === "/"}
              trackingData={{
                action: tracking.action.open_home,
                category: trackingCategory,
                label: tracking.label.header,
              }}
              onClickCallback={() => setShouldOpenMenu(false)}
            >
              Home
            </NavBarMenuItem>
            <NavBarMenuItem
              key="blog"
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
              onClickCallback={() => setShouldOpenMenu(false)}
            >
              Blog
            </NavBarMenuItem>
            <NavBarMenuItem
              key="art"
              variant="header"
              to={slugs.art}
              selected={pathname === slugs.art}
              trackingData={{
                action: tracking.action.open_art,
                category: trackingCategory,
                label: tracking.label.header,
              }}
              onClickCallback={() => setShouldOpenMenu(false)}
            >
              Art
            </NavBarMenuItem>
            <NavBarMenuItem
              key="aboutMe"
              variant="header"
              to={slugs.aboutMe}
              selected={pathname === slugs.aboutMe}
              trackingData={{
                action: tracking.action.open_about_me,
                category: trackingCategory,
                label: tracking.label.header,
              }}
              onClickCallback={() => setShouldOpenMenu(false)}
            >
              About me
            </NavBarMenuItem>
            <NavBarMenuItem
              key="chat"
              variant="header"
              to={slugs.chat}
              selected={pathname === slugs.chat}
              trackingData={{
                action: tracking.action.open_chat,
                category: trackingCategory,
                label: tracking.label.header,
              }}
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
                onClick={() => {
                  resetSearch()
                  setStartSearch(!startSearch);
                }}
                onChange={handleSearch}
              />
            )}
          </NavBar>
        </MenuGlassContent>
      </MenuContainer>
      <AnimatePresence>
        {(shouldOpenMenu || startSearch) && (
          <Overlay
            key="menu-overlay"
            zIndex={250}
            delay={0.1}
            onClick={() => {
              if (shouldOpenMenu) {
                setShouldOpenMenu(false);
              }
              if (startSearch) {
                setStartSearch(false);
              }
            }}
          >
            {results.length > 0 && !shouldOpenMenu && <SearchHits results={results} />}
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
};
