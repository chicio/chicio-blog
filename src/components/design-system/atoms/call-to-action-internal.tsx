'use client'

import styled from "styled-components";
import { callToActionStyle } from "./call-to-action-style";
import Link from "next/link";

export const CallToActionInternal = styled(Link)`
  ${callToActionStyle}
`;
