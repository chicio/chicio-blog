import { readLocalStorage, writeLocalStorage } from "../local-storage/local-storage";

const key = "cookieConsent";

const readConsent = () => readLocalStorage(key);

export const hasConsented = () => {
  return readConsent() === "accepted";
};

export const CONSENT_CHANGED_EVENT = "cookieConsentChanged";

export const writeConsent = (value: "accepted" | "rejected") => {
  writeLocalStorage(key, value);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: value }));
};
