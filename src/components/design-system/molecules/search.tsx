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
import { glassmorphism } from "../atoms/glassmorphism";

const SearchListContainer = styled(Container)`
  position: absolute;
  z-index: 100;
  top: 100px;
  right: 0;
  left: 0;
  bottom: 0;
  height: 80vh;
  overflow: scroll;
  ${hideScrollbar};
  padding: ${(props) => props.theme.spacing[2]}; /* Aumentato per contenere il glow effect */

  body.scroll-locked & {
    right: var(--scrollbar-width, 0px);
  }
  
  box-shadow: 
    inset 0 0 3px ${(props) => props.theme.dark.accentColor}AA,
    inset 0 0 8px ${(props) => props.theme.dark.accentColor}99,
    inset 0 0 10px ${(props) => props.theme.dark.accentColor}55;
  
  border: 1px solid ${(props) => props.theme.dark.accentColor}20;
  border-radius: ${(props) => props.theme.spacing[2]};

  width: 95%;

  ${mediaQuery.minWidth.xs} {
    width: 100%;
  }
`;

const SearchHitsList = styled(List)`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[2]};
  
  /* Container più piccolo per contenere il glow effect */
  margin: 0 auto;

  /* Override del before del List component per rimuovere le frecce */
  li::before {
    content: none;
  }
  
  li {
    padding-left: 0; /* Rimuove il padding-left del List component */
    margin-bottom: 0; /* Rimuove il margin-bottom del List component */
  }
`;

const SearchHitCard = styled.li`
  ${glassmorphism};
  padding: ${(props) => props.theme.spacing[2]}; /* Aumentato per più spazio interno */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Assicura che il contenuto sia allineato a sinistra */
  text-align: left;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 40px ${(props) => props.theme.dark.boxShadowLight},
      0 0 10px ${(props) => props.theme.dark.accentColor}33,
      inset 0 1px 0 ${(props) => props.theme.dark.accentColor}26;
    border-color: ${(props) => props.theme.dark.accentColor}66;
  }

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
  color: ${(props) => props.theme.dark.accentColor};
  margin-bottom: ${(props) => props.theme.spacing[2]};
  line-height: 1.3;
  margin: 0 0 ${(props) => props.theme.spacing[2]} 0; /* Reset margin per allineamento pulito */
  
  /* Matrix glow effect */
  text-shadow: 
    0 0 5px ${(props) => props.theme.dark.accentColor}40,
    0 0 10px ${(props) => props.theme.dark.accentColor}20;

  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[5]};
  }
`;

const SearchDescription = styled(Paragraph)`
  color: ${(props) => props.theme.dark.primaryTextColor};
  opacity: 0.9;
  line-height: 1.5;
  margin: 0;
  
  /* Subtle glow for description */
  text-shadow: 0 0 3px ${(props) => props.theme.dark.accentColor}15;
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
  border: 1px solid ${(props) => props.theme.dark.primaryTextColor};
  outline: none;
  transition: 0.5s;
  color: transparent;

  ${(props) =>
    props.$startSearch &&
    css`
      color: ${(props) => props.theme.dark.primaryTextColor};
      width: 150px;
      background: ${(props) => props.theme.dark.generalBackground};
      border: 1px solid ${(props) => props.theme.dark.accentColor};
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