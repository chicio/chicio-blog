import { FC, ReactNode } from "react";

export interface StatCardProps {
    value: number | string;
    label: string;
    icon?: ReactNode;
}

export const StatCard: FC<StatCardProps> = ({ value, label, icon }) => (
    <div className="glow-container flex min-h-30 min-w-0 flex-col items-center justify-between p-5">
        {icon && <span className="text-accent mb-1 text-2xl">{icon}</span>}
        <span className="text-accent w-full text-center text-2xl leading-none font-medium break-words tabular-nums text-shadow-lg sm:text-3xl md:text-4xl lg:text-6xl">
            {value}
        </span>
        <span className="text-accent mt-2 text-base">{label}</span>
    </div>
);
