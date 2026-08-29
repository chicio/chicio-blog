import { CallToActionExternalWithTracking } from "@/components/design-system/atoms/call-to-actions/call-to-action-external-with-tracking";
import { FC, ReactElement } from "react";

export interface SocialContactProps {
    link: string;
    onClick?: () => void;
    icon: ReactElement;
}

export const SocialContact: FC<SocialContactProps> = ({ link, onClick, icon }) => (
    <CallToActionExternalWithTracking
        className="min-w-auto"
        href={link}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
    >
        {icon}
    </CallToActionExternalWithTracking>
);
