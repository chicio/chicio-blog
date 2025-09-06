import { FC } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const InputField: FC<InputFieldProps> = ({
  className,
  ...props
}) => (
  <input className={`glow-border rounded-xl bg-none outline-none text-accent${className ? ` ${className}` : ""}`} {...props} />
);
