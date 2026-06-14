"use client";

import { FC, ReactElement, InputHTMLAttributes } from "react";
import { InputField } from "@/components/design-system/atoms/typography/input-field";
import { Label } from "../../atoms/typography/label";
export interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
    label: string;
    icon: ReactElement;
    hasError?: boolean;
}

export const FormField: FC<FormFieldProps> = ({ 
    label, 
    icon, 
    hasError = false,
    ...inputProps 
}) => {
    return (
        <div>
            <Label
                id={inputProps.id}
                value={label}
                icon={icon}
            />
            <InputField
                {...inputProps}
                className={`w-full px-4 py-3 ${hasError ? "border-red-500 focus:border-red-500" : ""}`}
            />
        </div>
    );
};
