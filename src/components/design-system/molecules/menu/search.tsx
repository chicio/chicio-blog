"use client";

import { SearchablePostFields } from "@/types/search";
import { tracking } from "@/types/tracking";
import { ChangeEvent, FC, useEffect, useRef } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { StandardInternalLinkWithTracking } from "../../atoms/links/standard-internal-link-with-tracking";
import { InputField } from "../../atoms/typography/input-field";
import { useGlassmorphism } from "../../utils/hooks/use-glassmorphism";

export const SearchBox: FC<{
  startSearch: boolean;
  onClick: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}> = ({ startSearch, onClick, onChange }) => {
  const hideOnStart = startSearch ? "opacity-0 -z-1" : "";
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTransitionEnd = () => {
    if (startSearch && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="xs:static [&:hover_*]:border-accent absolute top-2.5 right-2.5 ml-auto translate-0 rounded-full hover:shadow-lg">
      <InputField
        ref={inputRef}
        className={`active:text-accent hover:border-accent focus:text-accent h-[35px] p-2.5 text-transparent transition-all duration-300 ${startSearch ? "w-[130px]" : "w-[35px]"}`}
        aria-label="Search"
        placeholder={startSearch ? "Search" : ""}
        onChange={onChange}
        disabled={!startSearch}
        onTransitionEnd={handleTransitionEnd}
      />
      <span
        className={`hover:text-accent absolute top-[50%] right-[-3px] translate-x-[-50%] translate-y-[-50%] transition-all duration-200 ${hideOnStart}`}
        onClick={onClick}
      >
        <BiSearchAlt className="size-5" />
      </span>
    </div>
  );
};

export const SearchHits: FC<{ results: SearchablePostFields[] }> = ({
  results,
}) => {
  const { glassmorphismClass } = useGlassmorphism();

  return (
    <div
      className={`${glassmorphismClass} container-fixed remove-scroll-width glow-container hide-scrollbar xs:w-full absolute top-24 right-0 left-0 h-[80dvh] w-[95%] overflow-scroll`}
    >
      {results.map((result, index) => (
        <div
          className={`${glassmorphismClass} m-2 p-4 md:m-4`}
          key={"SearchResult" + index}
        >
          <StandardInternalLinkWithTracking
            className="no-underline"
            to={result.slug}
            trackingData={{
              category: tracking.category.blog_search,
              label: tracking.label.body,
              action: tracking.action.open_blog_post,
            }}
          >
            <h4>{result.title}</h4>
            <p>{result.description}</p>
          </StandardInternalLinkWithTracking>
        </div>
      ))}
    </div>
  );
};
