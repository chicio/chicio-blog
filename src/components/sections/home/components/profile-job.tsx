import styled from "styled-components";
import { Heading5 } from "@/components/design-system/atoms/typography/heading5";

export const ProfileJob = styled(Heading5)`
  color: ${(props) => props.theme.dark.secondaryTextColor};
  margin: ${(props) => props.theme.spacing[2]} 0
    ${(props) => props.theme.spacing[6]} 0;
  text-align: center;
`;
