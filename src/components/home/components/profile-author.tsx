import styled from "styled-components";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";
import { Heading1 } from "@/components/design-system/atoms/heading1";

export const ProfileAuthor = styled(Heading1)`
  font-size: ${(props) => props.theme.fontSizes[9]};
  margin: ${(props) => props.theme.spacing[2]} 0;
  text-align: center;
  color: ${(props) => props.theme.dark.primaryTextColor};

  ${mediaQuery.minWidth.md} {
    font-size: ${(props) => props.theme.fontSizes[12]};
  }
`;
