import React from "react";

export const ParagraphTitleWithIcon: React.FC<{
    icon: React.ReactNode;
    children: string;
}> = ({ icon, children }) => {
    return (
        <span className="flex items-center gap-2">
            {icon} {children}
        </span>
    );
};
