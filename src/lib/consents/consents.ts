const readConsent = () => {
  return localStorage.getItem("fabrizioduroni_cookieConsent");
};

export const hasConsented = () => {
  return readConsent() === "accepted";
};

export const writeConsent = (value: "accepted" | "rejected") => {
  localStorage.setItem("fabrizioduroni_cookieConsent", value);
};
