"use client";

export const useTrackingCallback = (onClick?: () => void): (() => void) => {
    return onClick ?? (() => {});
};
