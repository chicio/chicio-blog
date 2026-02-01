"use client";

import { FC } from "react";
import { BiErrorCircle } from "react-icons/bi";

/**
 * FormErrorSummary component
 * 
 * Displays a summary of all form validation errors.
 * Shows a list of error messages in a highlighted box.
 * Part of the design system for consistent error handling.
 * 
 * @author Fabrizio Duroni
 */

export interface FormErrorSummaryProps {
    errors: Record<string, string | undefined>;
    title?: string;
}

export const FormErrorSummary: FC<FormErrorSummaryProps> = ({ 
    errors, 
    title = "Please fix the following errors:" 
}) => {
    const errorMessages = Object.values(errors).filter(Boolean) as string[];

    if (errorMessages.length === 0) {
        return null;
    }

    return (
        <div className="rounded-lg border border-red-500 bg-red-500/10 p-4">
            <div className="flex flex-col items-start">
                <div className="flex flex-row items-center align-middle justify-center gap-1">
                    <BiErrorCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="font-medium text-red-500">{title}</p>
                </div>
                <div className="flex-1">
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-500">
                        {errorMessages.map((error, index) => (
                            <li key={index} className="before:content-none">
                                {error}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
