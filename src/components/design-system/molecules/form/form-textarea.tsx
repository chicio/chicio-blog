"use client";

import { FC, ReactElement, TextareaHTMLAttributes } from "react";
import { Textarea } from "@/components/design-system/atoms/typography/textarea";

/**
 * FormTextarea component
 * 
 * A textarea field with label, icon, and error state handling.
 * Part of the design system for consistent form styling.
 * 
 * @author Fabrizio Duroni
 */

export interface FormTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
    label: string;
    icon: ReactElement;
    hasError?: boolean;
}

export const FormTextarea: FC<FormTextareaProps> = ({ 
    label, 
    icon, 
    hasError = false,
    ...textareaProps 
}) => {
    return (
        <div>
            <label
                htmlFor={textareaProps.id}
                className="text-matrix-green mb-2 flex items-center gap-2 font-medium"
            >
                {icon}
                {label}
            </label>
            <Textarea
                {...textareaProps}
                className={`w-full px-4 py-3 ${hasError ? "border-red-500 focus:border-red-500" : ""}`}
            />
        </div>
    );
};
