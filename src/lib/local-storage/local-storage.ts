const PREFIX = "fabrizioduroni_";

export const readLocalStorage = (key: string) => {
  return localStorage.getItem(`${PREFIX}${key}`);
};

export const writeLocalStorage = (key: string, value: string) => {
  localStorage.setItem(`${PREFIX}${key}`, value);
};

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(`${PREFIX}${key}`);
};
