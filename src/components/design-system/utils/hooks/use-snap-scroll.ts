import { useEffect, useState } from "react";

export const useSnapScroll = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [totalSections, setTotalSections] = useState(0);

  useEffect(() => {
    const scrollContainer = document.querySelector("[data-snap-container]");

    if (!scrollContainer) {
      return;
    }

    const sections = Array.from(scrollContainer.children);
    setTotalSections(sections.length - 1);

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      let currentIdx = 0;

      for (let i = 0; i < sections.length; i++) {
        const sectionElement = sections[i] as HTMLElement;

        if (sectionElement.offsetTop > scrollTop) {
          currentIdx = i - 1 >= 0 ? i - 1 : 0;
          break;
        }

        if (
          i === sections.length - 1 &&
          scrollTop >= sectionElement.offsetTop
        ) {
          currentIdx = i;
        }
      }

      setCurrentSectionIndex(currentIdx);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollDown = () => {
    const scrollContainer = document.querySelector("[data-snap-container]");
    
    if (!scrollContainer) {
      return;
    }

    const sections = Array.from(scrollContainer.children);
    const nextSectionIndex = currentSectionIndex + 1;

    if (nextSectionIndex >= sections.length) {
      return;
    }

    const nextSection = sections[nextSectionIndex] as HTMLElement;
    const nextSectionTop = nextSection.offsetTop;

    scrollContainer.scrollTo({
      top: nextSectionTop,
      behavior: "smooth",
    });
  };

  return {
    currentSectionIndex,
    totalSections,
    handleScrollDown,
  };
};
