"use client";

import { FC } from "react";
import { BiErrorCircle } from "react-icons/bi";

export interface FormErrorSummaryProps {
  errorsList?: Record<string, string>;
  errorName?: string;
  show: boolean;
}

export const FormErrorSummary: FC<FormErrorSummaryProps> = ({
  errorsList,
  errorName,
  show
}) => {
  const errorMessages = errorsList ? Object.values(errorsList) : [];

  if (!show) {
    return null;
  }

  return (
    <div className="rounded-lg border border-red-500 bg-red-500/10 p-4">
      <div className="flex flex-col items-start">
        <div className="flex flex-row items-center justify-center gap-1 align-middle">
          <BiErrorCircle size={20} className="mt-0.5 shrink-0 text-red-500" />
          <p className="font-medium text-red-500">{errorName}</p>
        </div>
        {errorMessages.length > 0 && (
          <div className="flex-1">
            <ul className="list-inside list-disc space-y-1 text-sm text-red-500">
              {errorMessages.map((error, index) => (
                <li key={index} className="before:content-none">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
