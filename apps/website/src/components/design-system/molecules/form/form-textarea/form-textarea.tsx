"use client";

import { FC, ReactElement, TextareaHTMLAttributes } from "react";
import { Textarea } from "@/components/design-system/atoms/typography/textarea";
import { Label } from "@/components/design-system/atoms/typography/label";

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
}) => (
    <div>
        <Label id={textareaProps.id} value={label} icon={icon} />
        <Textarea
            {...textareaProps}
            className={`w-full px-4 py-3 ${hasError ? "border-red-500 focus:border-red-500" : ""}`}
        />
    </div>
);
