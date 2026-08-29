import { FC, ReactNode } from "react";

export interface StatCardProps {
    value: number | string;
    label: string;
    icon?: ReactNode;
}

export const StatCard: FC<StatCardProps> = ({ value, label, icon }) => (
    <div className="glow-container flex min-h-30 min-w-0 flex-col items-center justify-between p-5">
        {icon && <span className="text-accent text-2xl mb-1">{icon}</span>}
        <span className="text-accent text-shadow-lg w-full text-center text-2xl leading-none font-medium break-words tabular-nums sm:text-3xl md:text-4xl lg:text-6xl">
            {value}
        </span>
        <span className="text-accent text-base mt-2">{label}</span>
    </div>
);
