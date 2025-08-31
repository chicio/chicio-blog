import styled from "styled-components";

export const ToolStatusPill = styled.div`
  z-index: 2;
  margin: ${(props) => props.theme.spacing[2]} 0;

  * {
      font-size: ${(props) => props.theme.fontSizes[0]};
      min-width: 100% !important;
      width: 100%;
  }
`;