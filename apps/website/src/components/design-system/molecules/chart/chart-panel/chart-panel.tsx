import { FC, PropsWithChildren } from "react";
import { SectionHeading } from "@/components/design-system/molecules/typography/section-heading";

export interface ChartPanelProps {
    title?: string;
    description?: string;
}

export const ChartPanel: FC<PropsWithChildren<ChartPanelProps>> = ({ title, description, children }) => (
    <section className="glow-container bg-accent-alpha-10 h-full p-6">
        {title && (
            <SectionHeading
                title={title}
                description={description}
            />
        )}
        {children}
    </section>
);
