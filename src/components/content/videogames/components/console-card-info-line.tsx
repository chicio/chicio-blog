import { FC, ReactNode } from "react";

export const ConsoleCardInfoLine: FC<{ icon: ReactNode; label: string; value: string | number | undefined }> = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center gap-2 text-sm sm:text-base">
      {icon}
      <span className="text-secondary">{label}</span>
      <span className="text-primary-text">{value}</span>
    </div>
  );
}