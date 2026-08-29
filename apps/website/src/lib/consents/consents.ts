import { readLocalStorage, writeLocalStorage } from "../local-storage/local-storage";

const key = "cookieConsent";

const readConsent = () => readLocalStorage(key);

export const hasConsented = () => {
  return readConsent() === "accepted";
};

export const hasMadeConsentDecision = () => {
  return readConsent() !== null;
};

export const consentChangeEvent = "cookieConsentChanged";

export const writeConsent = (value: "accepted" | "rejected") => {
  writeLocalStorage(key, value);
  window.dispatchEvent(new CustomEvent(consentChangeEvent, { detail: value }));
};
