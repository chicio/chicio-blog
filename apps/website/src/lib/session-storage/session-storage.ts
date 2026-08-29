const prefix = "fabrizioduroni_";

export const readSessionStorage = (key: string) => {
    return sessionStorage.getItem(`${prefix}${key}`);
};

export const writeSessionStorage = (key: string, value: string) => {
    sessionStorage.setItem(`${prefix}${key}`, value);
};
