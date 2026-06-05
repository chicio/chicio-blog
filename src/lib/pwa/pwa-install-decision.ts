import { readLocalStorage, writeLocalStorage } from "../local-storage/local-storage";

export type PwaInstallDecision = "dismissed" | "installed";

const key = "pwaInstallDecision";

export const pwaInstallDecisionChangeEvent = "pwaInstallDecisionChanged";

export const readPwaInstallDecision = (): PwaInstallDecision | null => {
  const value = readLocalStorage(key);
  if (value === "dismissed" || value === "installed") {
    return value;
  }
  return null;
};

export const writePwaInstallDecision = (value: PwaInstallDecision) => {
  writeLocalStorage(key, value);
  window.dispatchEvent(new CustomEvent(pwaInstallDecisionChangeEvent, { detail: value }));
};
