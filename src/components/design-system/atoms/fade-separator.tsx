import styled from "styled-components";

export const FadeSeparator = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    ${(props) => props.theme.dark.accentColor},
    transparent
  );
  opacity: 0.6;
`;