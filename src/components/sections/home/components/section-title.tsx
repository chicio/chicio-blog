import styled from "styled-components";
import { Heading2 } from "@/components/design-system/atoms/typography/heading2";

export const SectionTitle = styled(Heading2)`
  margin-bottom: ${(props) => props.theme.spacing[4]};
  text-align: center;
`;
