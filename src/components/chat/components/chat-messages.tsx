import styled from "styled-components";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";
import { menuHeightNumber } from "@/components/design-system/organism/menu";

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${menuHeightNumber * 2 + 10}px 0 calc(140px + env(safe-area-inset-bottom, 0px)) 0;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[3]};
  scroll-behavior: smooth;

  ${mediaQuery.minWidth.sm} {
    padding: 160px 0 ${(props) => props.theme.spacing[12]} 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
  -ms-overflow-style: none;
`;
