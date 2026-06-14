import { FC, InputHTMLAttributes, ReactElement } from "react";

export interface LabelProps extends Omit<
  InputHTMLAttributes<HTMLLabelElement>,
  "className"
> {
  value: string;
  icon?: ReactElement
}

export const Label: FC<LabelProps> = ({ value, icon, ...labelProps }) => {
  return (
    <label
      htmlFor={labelProps.id}
      className="text-matrix-green mb-2 flex items-center gap-2 font-medium"
    >
      {icon}
      {value}
    </label>
  );
};
