'use client'

import styled, { css } from "styled-components";
import { MenuItemWithTracking } from "./menu-item-with-tracking";
import { mediaQuery } from "../../utils/media-query";
import { glowText } from "../../atoms/effects/glow";

interface MatrixMenuItemProps {
  selected?: boolean;
  variant?: 'default' | 'header' | 'footer';
  onClickCallback?: () => void;
}

export const MatrixMenuItem = styled(MenuItemWithTracking)<MatrixMenuItemProps>`
  color: ${(props) => props.theme.colors.primaryTextColor} !important;
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
  ${glowText}

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

  ${(props) => props.selected && css`
    color: ${props.theme.colors.accentColor} !important;
    background: ${props.theme.colors.accentColor}26;
    border-color: ${props.theme.colors.accentColor};
    box-shadow: 
      0 0 20px ${props.theme.colors.accentColor}33,
      inset 0 1px 0 ${props.theme.colors.accentColor}1A;

    &::before {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(45deg, 
        ${props.theme.colors.accentColor}00,
        ${props.theme.colors.accentColor}40,
        ${props.theme.colors.accentColor}00
      );
      border-radius: 8px;
      z-index: -1;
      opacity: 0.6;
    }
  `}

  &:hover {
    color: ${(props) => props.theme.colors.accentColor} !important;
    background: ${(props) => props.theme.colors.accentColor}1A;
    border-color: ${(props) => props.theme.colors.accentColor};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${(props) => props.theme.colors.accentColor}33;

    ${(props) => !props.selected && css`
      /* Hover più intenso per gli elementi non selezionati */
      box-shadow: 
        0 4px 12px ${props.theme.colors.accentColor}4D,
        0 0 8px ${props.theme.colors.accentColor}26;
    `}
  }

  ${(props) => props.selected && css`
    &:hover {
      transform: none;
      box-shadow: 
        0 0 20px ${props.theme.colors.accentColor}4D,
        inset 0 1px 0 ${props.theme.colors.accentColor}26;
    }
  `}
`;
