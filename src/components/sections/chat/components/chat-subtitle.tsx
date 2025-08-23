import styled from "styled-components";
import { Paragraph } from "@/components/design-system/atoms/typography/paragraph";
import { glowText } from "@/components/design-system/atoms/effects/glow";
import { mediaQuery } from "@/components/design-system/utils/media-query";

export const ChatSubtitle = styled(Paragraph)`
  ${glowText}
  font-size: ${(props) => props.theme.fontSizes[1]};

  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[2]};
  }
`;
