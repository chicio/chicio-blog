"use client";

import { ChangeEvent, FC } from "react";
import { BiSearchAlt } from "react-icons/bi";

export interface FilterInputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

export const FilterInput: FC<FilterInputProps> = ({ value, onChange, placeholder = "Filter..." }) => (
    <div className="glow-container flex items-center gap-3 px-3 py-3">
        <BiSearchAlt className="text-accent size-5 shrink-0" />
        <input
            className="text-accent w-full bg-transparent outline-none"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            aria-label={placeholder}
        />
    </div>
);
