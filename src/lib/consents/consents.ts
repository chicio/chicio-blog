import { readLocalStorage, writeLocalStorage } from "../local-storage/local-storage";

const key = "cookieConsent";

const readConsent = () => readLocalStorage(key);

export const hasConsented = () => {
  return readConsent() === "accepted";
};

export const writeConsent = (value: "accepted" | "rejected") => {
  writeLocalStorage(key, value);
};
