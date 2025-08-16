import { keyframes } from "styled-components";

export const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 255, 65, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 255, 65, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 65, 0);
  }
`;
