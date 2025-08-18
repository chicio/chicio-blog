import styled from "styled-components";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";
import { menuHeightNumber } from "@/components/design-system/organism/menu";
import { hideScrollbar } from "@/components/design-system/utils-css/hide-scrollbar";

export const MessagesContainer = styled.div<{ $hasMessages?: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: ${(props) => 
    props.$hasMessages 
      ? `${menuHeightNumber + 10}px 0 calc(140px + env(safe-area-inset-bottom, 0px)) 0`
      : `${menuHeightNumber * 2 + 10}px 0 calc(140px + env(safe-area-inset-bottom, 0px)) 0`
  };
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[3]};
  transition: padding 0.4s ease;

  ${mediaQuery.minWidth.sm} {
    padding: ${(props) => 
      props.$hasMessages 
        ? `${menuHeightNumber + 20}px 0 ${props.theme.spacing[12]} 0`
        : `160px 0 ${props.theme.spacing[12]} 0`
    };
  }

  ${hideScrollbar};
`;
