import styled from "styled-components";
import { Heading1 } from "@/components/design-system/atoms/typography/heading1";

export const ProfileAuthor = styled(Heading1)`
  margin: ${(props) => props.theme.spacing[2]} 0;
  text-align: center;
  color: ${(props) => props.theme.dark.primaryTextColor};
`;
