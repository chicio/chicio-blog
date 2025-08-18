'use client'

import styled, { css } from "styled-components";
import { MenuItemWithTracking } from "../atoms/menu-item-with-tracking";
import { mediaQuery } from "../utils-css/media-query";

interface MatrixMenuItemProps {
  selected?: boolean;
  variant?: 'default' | 'header' | 'footer';
  onClickCallback?: () => void;
}

export const MatrixMenuItem = styled(MenuItemWithTracking)<MatrixMenuItemProps>`
  color: ${(props) => props.theme.dark.primaryTextColor} !important;
  text-decoration: none;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid transparent;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Base styling per varianti */
  ${(props) => props.variant === 'footer' && css`
    font-size: ${props.theme.fontSizes[1]};
    padding: ${props.theme.spacing[3]} ${props.theme.spacing[2]};

    ${mediaQuery.minWidth.md} {
      font-size: ${props.theme.fontSizes[2]};
      padding: ${props.theme.spacing[3]} ${props.theme.spacing[3]};
    }

    ${mediaQuery.minWidth.lg} {
      padding: ${props.theme.spacing[2]} ${props.theme.spacing[4]};
    }
  `}

  ${(props) => props.variant === 'header' && css`
    font-size: ${props.theme.fontSizes[2]};
    padding: ${props.theme.spacing[3]} ${props.theme.spacing[4]};
    margin-right: ${props.theme.spacing[3]};

    ${mediaQuery.minWidth.md} {
      font-size: ${props.theme.fontSizes[3]};
      padding: ${props.theme.spacing[3]} ${props.theme.spacing[5]};
      margin-right: ${props.theme.spacing[4]};
    }
  `}

  /* Stato selected (pagina corrente) */
  ${(props) => props.selected && css`
    color: ${props.theme.dark.accentColor} !important;
    background: ${props.theme.dark.accentColor}26;
    border-color: ${props.theme.dark.accentColor};
    box-shadow: 
      0 0 20px ${props.theme.dark.accentColor}33,
      inset 0 1px 0 ${props.theme.dark.accentColor}1A;

    /* Glow effect per la pagina corrente */
    &::before {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(45deg, 
        ${props.theme.dark.accentColor}00,
        ${props.theme.dark.accentColor}40,
        ${props.theme.dark.accentColor}00
      );
      border-radius: 8px;
      z-index: -1;
      opacity: 0.6;
    }
  `}

  /* Hover effect */
  &:hover {
    color: ${(props) => props.theme.dark.accentColor} !important;
    background: ${(props) => props.theme.dark.accentColor}1A;
    border-color: ${(props) => props.theme.dark.accentColor};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${(props) => props.theme.dark.accentColor}33;

    ${(props) => !props.selected && css`
      /* Hover più intenso per gli elementi non selezionati */
      box-shadow: 
        0 4px 12px ${props.theme.dark.accentColor}4D,
        0 0 8px ${props.theme.dark.accentColor}26;
    `}
  }

  /* Disabled state per elementi selezionati in hover */
  ${(props) => props.selected && css`
    &:hover {
      transform: none;
      box-shadow: 
        0 0 20px ${props.theme.dark.accentColor}4D,
        inset 0 1px 0 ${props.theme.dark.accentColor}26;
    }
  `}
`;
