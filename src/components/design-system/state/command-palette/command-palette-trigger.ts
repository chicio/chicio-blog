/**
 * What caused a palette to open or close. Consumers need this to tell a deliberate open (the header
 * button dispatching the open event) apart from an incidental one (the keyboard shortcut).
 */
export type CommandPaletteTrigger = "shortcut" | "event" | "escape" | "dismiss";
