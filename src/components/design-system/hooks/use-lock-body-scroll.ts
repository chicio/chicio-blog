import { useLayoutEffect } from "react";

export const useLockBodyScroll = () => {
  useLayoutEffect(() => {
    // Salva gli stili originali
    const originalStyle = window.getComputedStyle(document.body);
    const originalPositionStyle = originalStyle.position;
    const originalTopStyle = originalStyle.top;
    const originalLeftStyle = originalStyle.left;
    const originalRightStyle = originalStyle.right;
    const originalOverflowStyle = originalStyle.overflow;
    const originalPaddingRightStyle = originalStyle.paddingRight;

    // Calcola la larghezza della scrollbar PRIMA di nasconderla
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Salva la posizione di scroll corrente
    const currentScrollYPosition =
      (window.scrollY || document.documentElement.scrollTop) -
      (document.documentElement.clientTop || 0);

    // Applica gli stili per bloccare lo scroll
    document.body.style.position = "fixed";
    document.body.style.top = -currentScrollYPosition + "px";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    
    // IMPORTANTE: Compensa la larghezza della scrollbar con padding-right
    // per prevenire il layout shift
    if (scrollbarWidth > 0) {
      const currentPaddingRight = parseInt(originalPaddingRightStyle) || 0;
      document.body.style.paddingRight = (currentPaddingRight + scrollbarWidth) + "px";
      
      // Aggiunge una classe al body per indicare che lo scroll è locked
      document.body.classList.add('scroll-locked');
      document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
    }

    // Cleanup function
    return () => {
      // Ripristina tutti gli stili originali
      document.body.style.position = originalPositionStyle;
      document.body.style.top = originalTopStyle;
      document.body.style.left = originalLeftStyle;
      document.body.style.right = originalRightStyle;
      document.body.style.overflow = originalOverflowStyle;
      document.body.style.paddingRight = originalPaddingRightStyle;
      
      // Rimuove la classe e la CSS custom property
      document.body.classList.remove('scroll-locked');
      document.documentElement.style.removeProperty('--scrollbar-width');
      
      // Ripristina la posizione di scroll
      window.scrollTo(0, currentScrollYPosition);
    };
  }, []);
};
