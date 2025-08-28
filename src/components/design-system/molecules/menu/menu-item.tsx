'use client'

import styled from "styled-components";
import Link from "next/link";

export interface MenuItemProps {
    selected?: boolean;
}

export const MenuItem = styled(Link)<MenuItemProps>`
    color: ${(props) =>
            props.selected
                    ? props.theme.colors.textAbovePrimaryColor
                    : props.theme.colors.primaryColorLight};
    font-size: ${(props) => props.theme.fontSizes[2]};
    font-weight: 500;
    text-decoration: none;
    line-height: ${(props) => props.theme.lineHeight};

    &:hover,
    &:focus {
        color: ${(props) => props.theme.colors.textAbovePrimaryColor};
        text-decoration: none;
    }
`;
