import { FC } from "react";

interface VideogameCollectionDataCardProps {
  quantity: number;
  label: string;
}

export const VideogameCollectionDataCard: FC<VideogameCollectionDataCardProps> = ({
  quantity,
  label,
}) => {
  return (
    <div
      className="glow-container flex flex-col min-h-30 cursor-pointer items-center justify-between p-5"
      key={label}
    >
      <span className="text-accent text-shadow-lg text-6xl font-medium">{quantity}</span>
      <span className="text-accent text-base mt-2">{label}</span>
    </div>
  );
};