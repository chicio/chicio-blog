"use client";

import styled, { css } from "styled-components";
import Link from "next/link";
import { mediaQuery } from "../../utils/media-query";
import { glowText } from "../../atoms/effects/glow";
import { borderRadius } from "../../atoms/effects/border";

export interface MenuItemProps {
  selected?: boolean;
}

export const MenuItem = styled(Link)<MenuItemProps>`
  color: ${(props) =>
    props.selected
      ? props.theme.colors.accentColor
      : props.theme.colors.primaryTextColor};
  padding: ${(props) => props.theme.spacing[3]}
    ${(props) => props.theme.spacing[4]};
  font-size: ${(props) => props.theme.fontSizes[2]};
  font-weight: 500;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  ${borderRadius};
  ${glowText};

  ${(props) =>
    props.selected &&
    css`
      background: ${props.theme.colors.accentColor}26;
      border-color: ${props.theme.colors.accentColor};

      &::before {
        content: "";
        position: absolute;
        inset: -2px;
        background: linear-gradient(
          45deg,
          ${props.theme.colors.accentColor}00,
          ${props.theme.colors.accentColor}40,
          ${props.theme.colors.accentColor}00
        );
        z-index: -1;
        opacity: 0.6;
        ${borderRadius};
      }
    `}

  &:hover {
    color: ${(props) => props.theme.colors.accentColor};
    background: ${(props) => props.theme.colors.accentColor}1A;
    border-color: ${(props) => props.theme.colors.accentColor};
    transform: translateY(-1px);

    ${(props) =>
      !props.selected
        ? css`
            box-shadow:
              0 4px 12px ${props.theme.colors.accentColor}4D,
              0 0 8px ${props.theme.colors.accentColor}26;
          `
        : css`
            transform: none;
            box-shadow:
              0 0 20px ${props.theme.colors.accentColor}4D,
              inset 0 1px 0 ${props.theme.colors.accentColor}26;
          `};
  }

  ${mediaQuery.minWidth.md} {
    font-size: ${(props) => props.theme.fontSizes[3]};
    padding: ${(props) => props.theme.spacing[3]}
      ${(props) => props.theme.spacing[5]};
  }
`;
