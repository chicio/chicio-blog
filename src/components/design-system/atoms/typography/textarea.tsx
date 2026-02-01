import { FC, RefObject } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  ref?: RefObject<HTMLTextAreaElement | null>;
}

export const Textarea: FC<TextareaProps> = ({ className, ...props }) => (
  <textarea
    className={`glow-container w-full rounded-xl bg-none outline-none text-accent${className ? ` ${className}` : ""}`}
    {...props}
  />
);
