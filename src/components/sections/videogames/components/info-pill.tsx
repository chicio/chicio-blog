import { FC, ReactNode } from "react";

interface InfoPillProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export const InfoPill: FC<InfoPillProps> = ({ icon, label, value }) => (
  <div className="glow-container flex flex-1 items-center justify-center gap-2 px-4 py-2">
    <div className="text-primary text-lg">{icon}</div>
    <span className="text-secondary text-sm">{label}:</span>
    <span className="text-primary-text font-semibold">{value}</span>
  </div>
);
