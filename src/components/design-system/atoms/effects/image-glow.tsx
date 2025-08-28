import styled from "styled-components";
import { glowContainer } from "./glow";
import Image from "next/image";

export const ImageGlow = styled(Image)`
  ${glowContainer};
`