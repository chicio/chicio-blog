export const isWebGPUSupported = (): boolean =>
  typeof navigator !== 'undefined' && 'gpu' in navigator;
