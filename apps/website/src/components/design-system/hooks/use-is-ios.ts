export const useIsIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iP(ad|hone|od)/.test(window.navigator.userAgent);
}