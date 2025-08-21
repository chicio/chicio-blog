import { useLayoutEffect } from "react";

export const useLockBodyScroll = () => {
  useLayoutEffect(() => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.documentElement.style.overflow;
    const originalPaddingRight = document.documentElement.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.documentElement.style.overflow = "hidden";

    if (scrollBarWidth > 0) {
      document.documentElement.style.paddingRight = `${scrollBarWidth}px`;
      document.body.classList.add('scroll-locked');
      document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
    }

    return () => {
      document.documentElement.style.overflow = originalOverflow;
      document.documentElement.style.paddingRight = originalPaddingRight;
      document.body.classList.remove('scroll-locked');
      document.documentElement.style.removeProperty('--scrollbar-width');
    };
  }, []);
};
