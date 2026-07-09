import { FC } from "react";

export interface SectionHeadingProps {
    title: string;
    description?: string;
}

export const SectionHeading: FC<SectionHeadingProps> = ({ title, description }) => (
    <div className="mb-5">
        <h2 className="text-accent text-shadow-md mb-1 text-lg font-bold">
            <span aria-hidden="true">&gt;&nbsp;</span>
            {title}
        </h2>
        {description && <p className="text-secondary mb-0 text-sm">{description}</p>}
    </div>
);
