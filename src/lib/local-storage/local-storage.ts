const prefix = "fabrizioduroni_";

export const readLocalStorage = (key: string) => {
  return localStorage.getItem(`${prefix}${key}`);
};

export const writeLocalStorage = (key: string, value: string) => {
  localStorage.setItem(`${prefix}${key}`, value);
};
