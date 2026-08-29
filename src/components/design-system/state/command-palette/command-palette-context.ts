"use client";

import { createContext } from "react";

export type CommandPaletteClose = () => void;

/**
 * Scopes "close the palette I belong to" to the enclosing CommandPalette, so that two palettes on
 * one page never close each other. Out-of-tree callers use closeCommandPalette() instead.
 */
export const CommandPaletteContext = createContext<CommandPaletteClose | null>(null);
