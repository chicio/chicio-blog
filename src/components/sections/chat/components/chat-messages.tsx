import { hideScrollbar } from "@/components/design-system/utils/components/hide-scrollbar";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import styled from "styled-components";

export const MessagesContainer = styled.div`
  flex: 1;
  padding: ${(props) => `${props.theme.spacing[6]} 0 calc(140px + env(safe-area-inset-bottom, 0px)) 0`};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[3]};
  transition: padding 0.4s ease;

  ${mediaQuery.minWidth.sm} {
    padding: ${(props) => `${props.theme.spacing[10]} 0 140px 0`};
  }

  ${hideScrollbar};
`;
