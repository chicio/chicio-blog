import styled from "styled-components";
import { Heading1 } from "../atoms/heading1";
import { mediaQuery } from "../utils-css/media-query";
import { FC } from "react";

const CenteredHeading = styled(Heading1)`
  text-align: center;

  ${mediaQuery.maxWidth.md} {
    font-size: ${(props) => props.theme.fontSizes[8]};
  }
`;

const ClownBackground = styled.div`
  background: linear-gradient(45deg, red, yellow, blue, green, orange);
  padding: 20px;
  margin-bottom: 20px;
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const ClownTitle: FC = () =>    
    <ClownBackground>
        <CenteredHeading>
        🤡 Clownified!! 🤡
        </CenteredHeading>
    </ClownBackground>