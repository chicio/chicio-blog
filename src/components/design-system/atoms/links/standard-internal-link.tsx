'use client'

import styled from "styled-components";
import { standardLinkStyle } from "./standard-link-style";
import Link from "next/link";

export const StandardInternalLink = styled(Link)`
  ${standardLinkStyle}
`;
