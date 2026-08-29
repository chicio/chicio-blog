"use client";

import { usePathname } from "next/navigation";
import type { StateStore } from "@/types/component-store";

interface MenuState {
    currentPath: string;
}

export const useMenuStore = (): StateStore<MenuState> => ({
    state: { currentPath: usePathname() },
});
