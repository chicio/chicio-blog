'use client'

import React, {ChangeEvent, FC} from "react";
import styled, {css, TransientProps} from "styled-components";
import {SearchAlt} from "@styled-icons/boxicons-regular";
import {mediaQuery} from "../utils/media-query";
import {Container} from "../atoms/container";
import {List} from "../atoms/list";
import {Paragraph} from "../atoms/paragraph";
import {borderRadius} from "../atoms/border-radius";
import {SearchablePostFields} from "@/types/post";
import Link from "next/link";
import { hideScrollbar } from "../utils/components/hide-scrollbar";

const SearchListContainer = styled(Container)`
  position: absolute;
    z-index: 100;
  top: 100px;
  right: 0;
  left: 0;
  bottom: 0;
  height: 80vh;
  overflow: scroll;
  ${borderRadius};
  ${hideScrollbar};
`;

const SearchHitsList = styled(List)`
  list-style: none;
  padding: ${(props) => props.theme.spacing[2]};
  margin: ${(props) => props.theme.spacing[6]} 0;
  background-color: ${(props) => props.theme.light.generalBackground};
  ${borderRadius};

  ${mediaQuery.dark} {
    background-color: ${(props) => props.theme.dark.generalBackground};
  }
`;

const SearchHitContainer = styled.li`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${(props) => props.theme.light.dividerColor};

  ${mediaQuery.dark} {
    border-bottom: 1px solid ${(props) => props.theme.dark.dividerColor};
  }
`;

const SearchLink = styled(Link)`
  text-decoration: none;
  display: flex;
  flex-direction: column;
`;

const SearchTitle = styled(Paragraph)`
  font-size: ${(props) => props.theme.fontSizes[3]};
  color: ${(props) => props.theme.light.accentColor};

  ${mediaQuery.dark} {
    color: ${(props) => props.theme.dark.accentColor};
  }
`;

const SearchBoxContainer = styled.div`
  transform: translate(0, 0);
  margin-left: auto;
  position: absolute;
  top: 10px;
  right: 10px;

  ${mediaQuery.minWidth.sm} {
    position: static;
    margin-left: auto;
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
  color: ${(props) => props.theme.dark.primaryTextColor};
  transition: 0.2s;

  ${(props) =>
    props.$startSearch &&
    css`
      opacity: 0;
      z-index: -1;
    `}
`;

const SearchBoxInput = styled.input<TransientProps<StartSearchProps>>`
  padding: 10px;
  width: 35px;
  height: 35px;
  background: none;
  border-radius: 50px;
  box-sizing: border-box;
  font-size: ${(props) => props.theme.fontSizes[3]};
  border: 2px solid ${(props) => props.theme.dark.primaryTextColor};
  outline: none;
  transition: 0.5s;
  color: transparent;

  ${(props) =>
    props.$startSearch &&
    css`
      color: ${(props) => props.theme.dark.primaryTextColor};
      width: 200px;
      background: ${(props) => props.theme.dark.generalBackground};
      border: 2px solid ${(props) => props.theme.dark.accentColor};
      ${borderRadius};
    `}
`;

interface OnClickProp {
  onClick: () => void;
}

export const SearchBox: FC<
  StartSearchProps & OnClickProp & { onChange: (e: ChangeEvent<HTMLInputElement>) => void }
> = ({ startSearch, onClick, onChange }) => (
  <SearchBoxContainer>
    <SearchBoxInput
      $startSearch={startSearch}
      placeholder={startSearch ? "Search" : ""}
      onChange={onChange}
      disabled={!startSearch}
    />
    <SearchAltContainer $startSearch={startSearch} onClick={onClick}>
      <SearchAlt width={20} height={20} />
    </SearchAltContainer>
  </SearchBoxContainer>
);

export const SearchHits: FC<{ results: SearchablePostFields[] }> = ({ results }) => (
  <SearchListContainer>
    <SearchHitsList>
      {results.map((result, index) => (
        <SearchHitContainer key={"SearchResult" + index}>
          <SearchLink href={result.slug}>
            <SearchTitle>{result.title}</SearchTitle>
            <Paragraph>{result.description}</Paragraph>
          </SearchLink>
        </SearchHitContainer>
      ))}
    </SearchHitsList>
  </SearchListContainer>
);