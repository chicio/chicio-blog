import {ChangeEvent, useState} from "react";
import {SearchablePostFields} from "@/types/post";

const hasMinimumCharsToSearch = (query: string): boolean => query.length >= 3;

export const useSearch = (startSearch: boolean) => {
    const [results, setResults] = useState<SearchablePostFields[]>([]);

    const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!startSearch) {
            return;
        }

        const value = e.target.value.trim();

        if (value && hasMinimumCharsToSearch(value)) {
            const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
            const data = await response.json();
            setResults(data.results);
        } else {
            setResults([]);
        }
    };

    return {
        handleSearch,
        results
    }
};
