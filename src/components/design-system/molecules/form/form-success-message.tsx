import { FC } from "react";
import { BiCheckCircle } from "react-icons/bi";

export interface FormSuccessMessageProps {
  message: string;
}

export const FormSuccessMessage: FC<FormSuccessMessageProps> = ({
  message,
}) => {
  return (
    <div className="glow-container rounded-lg border border-accent-color bg-accent-color/10 p-4">
      <div className="flex items-center gap-3">
        <BiCheckCircle size={24} className="text-accent shrink-0" />
        <p className="text-accent font-bold">{message}</p>
      </div>
    </div>
  );
};
