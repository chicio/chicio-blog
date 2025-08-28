import styled from "styled-components";

export const FadeSeparator = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
      ${(props) => props.theme.colors.generalBackgroundLight},
      ${(props) => props.theme.colors.accentColor},
      ${(props) => props.theme.colors.generalBackgroundLight}
  );
  opacity: 0.6;
`;
