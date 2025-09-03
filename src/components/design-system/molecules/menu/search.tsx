"use client";

import React, { ChangeEvent, FC } from "react";
import styled, { css, TransientProps } from "styled-components";
import { BiSearchAlt } from "react-icons/bi";
import { mediaQuery } from "../../utils/media-query";
import { List } from "../../atoms/typography/list";
import { Paragraph } from "../../atoms/typography/paragraph";
import { borderColor, borderRadius } from "../../atoms/effects/border";
import Link from "next/link";
import { hideScrollbar } from "../../utils/components/hide-scrollbar";
import { glassmorphism } from "../../atoms/effects/glassmorphism";
import { glowText } from "../../atoms/effects/glow";
import { InputField } from "../../atoms/typography/input-field";
import { Container } from "../../atoms/containers/container";
import { SearchablePostFields } from "@/types/search";

const SearchListContainer = styled(Container)`
  position: absolute;
  top: 100px;
  right: 0;
  left: 0;
  bottom: 0;
  height: 80dvh;
  width: 95%;
  overflow: scroll;
  padding: ${(props) => props.theme.spacing[2]};
  body.scroll-locked & {
    right: var(--scrollbar-width, 0px);
  }
  backdrop-filter: blur(1px);
  box-shadow:
    inset 0 0 3px ${(props) => props.theme.colors.accentColor}AA,
    inset 0 0 8px ${(props) => props.theme.colors.accentColor}99,
    inset 0 0 10px ${(props) => props.theme.colors.accentColor}55;

  ${borderRadius};
  ${borderColor};
  ${hideScrollbar};

  ${mediaQuery.minWidth.xs} {
    width: 100%;
  }
`;

const SearchHitsList = styled(List)`
  padding: ${(props) => props.theme.spacing[1]};
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[2]};

  margin: 0 auto;

  li::before {
    content: none;
  }

  li {
    padding-left: 0;
    margin-bottom: 0;
  }
`;

const SearchHitCard = styled.li`
  ${glassmorphism};

  ${mediaQuery.inputDevice.mouse} {
    cursor: pointer;
  }
`;

const SearchLink = styled(Link)`
  text-decoration: none;
  display: block;
  width: 100%;
  height: 100%;
  padding: ${(props) => props.theme.spacing[4]};
`;

const SearchTitle = styled(Paragraph)`
  font-size: ${(props) => props.theme.fontSizes[4]};
  font-weight: 700;
  color: ${(props) => props.theme.colors.accentColor};
  margin-bottom: ${(props) => props.theme.spacing[2]};
  line-height: 1.3;
  margin: 0 0 ${(props) => props.theme.spacing[2]} 0;
  ${glowText};

  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[5]};
  }
`;

const SearchDescription = styled(Paragraph)`
  color: ${(props) => props.theme.colors.primaryTextColor};
  opacity: 0.9;
  line-height: 1.5;
  margin: 0;
  ${glowText};
`;

const SearchBoxContainer = styled.div<TransientProps<{ startSearch: boolean }>>`
  transform: translate(0, 0);
  margin-left: auto;
  position: absolute;
  top: 10px;
  right: 10px;
  color: ${(props) => props.theme.colors.primaryTextColor};
  border-radius: 50%;

  ${mediaQuery.minWidth.sm} {
    position: static;
    margin-left: auto;
  }

  ${mediaQuery.inputDevice.mouse} {
    &:hover,
    &:hover * {
      border-color: ${(props) => props.theme.colors.accentColor};
    }

    &:hover span {
      color: ${(props) => props.theme.colors.accentColor};
    }

    &:hover {
      background: ${(props) => !props.$startSearch && `${props.theme.colors.accentColor}1A`};
      box-shadow: ${(props) => !props.$startSearch && `0 4px 12px ${props.theme.colors.accentColor}33`};
    }
  }
`;

interface StartSearchProps {
  startSearch: boolean;
}

const SearchAltContainer = styled.span<TransientProps<StartSearchProps>>`
  position: absolute;
  top: 50%;
  right: -3px;
  transform: translate(-50%, -50%);
  transition: 0.2s;

  ${(props) =>
    props.$startSearch &&
    css`
      opacity: 0;
      z-index: -1;
    `}
`;

const SearchBoxInput = styled(InputField)<TransientProps<StartSearchProps>>`
  padding: 10px;
  width: 35px;
  height: 35px;

  ${(props) =>
    props.$startSearch &&
    css`
      width: 150px;
    `}
`;

interface OnClickProp {
  onClick: () => void;
}

export const SearchBox: FC<
  StartSearchProps &
    OnClickProp & { onChange: (e: ChangeEvent<HTMLInputElement>) => void }
> = ({ startSearch, onClick, onChange }) => (
  <SearchBoxContainer $startSearch={startSearch}>
    <SearchBoxInput
      aria-label="Search"
      $startSearch={startSearch}
      placeholder={startSearch ? "Search" : ""}
      onChange={onChange}
      disabled={!startSearch}
    />
    <SearchAltContainer $startSearch={startSearch} onClick={onClick}>
      <BiSearchAlt className="size-5" />
    </SearchAltContainer>
  </SearchBoxContainer>
);

export const SearchHits: FC<{ results: SearchablePostFields[] }> = ({
  results,
}) => (
  <SearchListContainer>
    <SearchHitsList>
      {results.map((result, index) => (
        <SearchHitCard key={"SearchResult" + index}>
          <SearchLink href={result.slug}>
            <SearchTitle>{result.title}</SearchTitle>
            <SearchDescription>{result.description}</SearchDescription>
          </SearchLink>
        </SearchHitCard>
      ))}
    </SearchHitsList>
  </SearchListContainer>
);
