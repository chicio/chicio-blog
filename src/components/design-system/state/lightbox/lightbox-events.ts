export interface LightboxOpenDetail {
    src: string;
    alt: string;
}

export const lightboxOpenEvent = "lightbox-open";

export const openLightbox = (detail: LightboxOpenDetail) => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent<LightboxOpenDetail>(lightboxOpenEvent, { detail }));
    }
};
