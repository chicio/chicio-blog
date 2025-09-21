import { useLayoutEffect } from "react";
import { useIsIOS } from "./use-is-ios";

export const useLockBodyScroll = () => {
  const isIOS = useIsIOS();

  useLayoutEffect(() => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.documentElement.style.overflow;
    const originalPaddingRight = document.documentElement.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    let originalBodyPosition = "";
    let originalBodyTop = "";
    let scrollY = 0;

    document.documentElement.style.overflow = "hidden";

    if (isIOS) {
      originalBodyPosition = document.body.style.position;
      originalBodyTop = document.body.style.top;
      scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
    }

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
      
      if (isIOS) {
        document.body.style.position = originalBodyPosition;
        document.body.style.top = originalBodyTop;
        window.scrollTo(0, scrollY);
      }
    };
  }, [isIOS]);
};

