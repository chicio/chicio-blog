import { FC } from "react";
import { BiCheckCircle } from "react-icons/bi";

export interface FormSuccessMessageProps {
    message: string;
}

export const FormSuccessMessage: FC<FormSuccessMessageProps> = ({ message }) => (
    <div className="glow-container border-accent-color bg-accent-color/10 rounded-lg border p-6">
        <div className="flex items-center gap-4">
            <BiCheckCircle size={38} className="text-accent mt-1 shrink-0" />
            <div className="flex flex-col gap-2">
                <p className="text-accent text-lg leading-relaxed font-bold">{message}</p>
            </div>
        </div>
    </div>
);
