import { FC, RefObject } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  ref?: RefObject<HTMLInputElement | null>;
}

export const InputField: FC<InputFieldProps> = ({
  className,
  ...props
}) => (
  <input className={`glow-container rounded-xl bg-none outline-none text-accent${className ? ` ${className}` : ""}`} {...props} />
);
