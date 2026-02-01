"use client";

import { FC, ReactElement, InputHTMLAttributes } from "react";
import { InputField } from "@/components/design-system/atoms/typography/input-field";

/**
 * FormField component
 * 
 * A form field with label, icon, and error state handling.
 * Part of the design system for consistent form styling.
 * 
 * @author Fabrizio Duroni
 */

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
            <label
                htmlFor={inputProps.id}
                className="text-matrix-green mb-2 flex items-center gap-2 font-medium"
            >
                {icon}
                {label}
            </label>
            <InputField
                {...inputProps}
                className={`w-full px-4 py-3 ${hasError ? "border-red-500 focus:border-red-500" : ""}`}
            />
        </div>
    );
};
