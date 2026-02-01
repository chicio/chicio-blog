import { FC } from "react";
import { BiCheckCircle } from "react-icons/bi";

export interface FormSuccessMessageProps {
  message: string;
}

export const FormSuccessMessage: FC<FormSuccessMessageProps> = ({
  message,
}) => {
  return (
    <div className="glow-container rounded-lg border border-accent-color bg-accent-color/10 p-6">
      <div className="flex items-center gap-4">
        <BiCheckCircle size={38} className="text-accent mt-1 shrink-0" />
        <div className="flex flex-col gap-2">
          <p className="text-accent text-lg font-bold leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
