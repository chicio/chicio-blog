import { FC, ReactNode } from "react";
import {
    AnchorLink,
    type LinkComponent,
    type PrefetchStrategy,
} from "@/components/design-system/atoms/links/anchor-link";

export interface InternalLinkProps {
    to: string;
    className?: string;
    children?: ReactNode;
    prefetch?: PrefetchStrategy;
    onClick?: () => void;
    linkComponent?: LinkComponent;
}

export const InternalLink: FC<InternalLinkProps> = ({
    children,
    className,
    to,
    onClick,
    prefetch = "viewport",
    linkComponent: Link = AnchorLink,
}) => (
    <Link className={className} href={to} prefetch={prefetch} onClick={onClick}>
        {children}
    </Link>
);
