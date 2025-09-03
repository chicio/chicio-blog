"use client";

import { SearchablePostFields } from "@/types/search";
import Link from "next/link";
import { ChangeEvent, FC } from "react";
import { BiSearchAlt } from "react-icons/bi";
import styled, { css, TransientProps } from "styled-components";
import { Container } from "../../atoms/containers/container";
import { borderColor, borderRadius } from "../../atoms/effects/border";
import { glassmorphism } from "../../atoms/effects/glassmorphism";
import { InputField } from "../../atoms/typography/input-field";
import { hideScrollbar } from "../../utils/components/hide-scrollbar";
import { mediaQuery } from "../../utils/media-query";

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

const SearchHitCard = styled.div`
  ${glassmorphism};
  margin: 12px;

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
      background: ${(props) =>
        !props.$startSearch && `${props.theme.colors.accentColor}1A`};
      box-shadow: ${(props) =>
        !props.$startSearch &&
        `0 4px 12px ${props.theme.colors.accentColor}33`};
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

interface OnClickProp {
  onClick: () => void;
}

export const SearchBox: FC<
  StartSearchProps &
    OnClickProp & { onChange: (e: ChangeEvent<HTMLInputElement>) => void }
> = ({ startSearch, onClick, onChange }) => (
  <SearchBoxContainer $startSearch={startSearch}>
    <InputField
      className={`h-[35px] p-2.5 text-transparent active:text-accent focus:text-accent transition-all duration-300 ${startSearch ? "w-[150px]" : "w-[35px]"}`}
      aria-label="Search"
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
      {results.map((result, index) => (
        <SearchHitCard key={"SearchResult" + index}>
          <SearchLink href={result.slug}>
            <h4>{result.title}</h4>
            <p>{result.description}</p>
          </SearchLink>
        </SearchHitCard>
      ))}
  </SearchListContainer>
);
