import styled from "styled-components";

export const FadeSeparator = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
      ${(props) => props.theme.dark.generalBackgroundLight},
      ${(props) => props.theme.dark.accentColor},
      ${(props) => props.theme.dark.generalBackgroundLight}
  );
  opacity: 0.6;
`;
