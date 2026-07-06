import { FC, ReactNode } from "react";

export interface StatCardProps {
    value: number | string;
    label: string;
    icon?: ReactNode;
}

export const StatCard: FC<StatCardProps> = ({ value, label, icon }) => (
    <div className="glow-container flex flex-col min-h-30 cursor-pointer items-center justify-between p-5">
        {icon && <span className="text-accent text-2xl mb-1">{icon}</span>}
        <span className="text-accent text-shadow-lg text-6xl font-medium">{value}</span>
        <span className="text-accent text-base mt-2">{label}</span>
    </div>
);
