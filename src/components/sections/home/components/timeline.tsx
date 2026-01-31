import { StandardExternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-external-link-with-tracking";
import { tracking } from "@/types/configuration/tracking";
import Image from "next/image";
import { FC } from "react";
import { BiBriefcase, BiSolidGraduation } from "react-icons/bi";
import { timelineData } from "@/types/home/timeline";

export const Timeline: FC = () => {
  const getIcon = (type: "work" | "education") => {
    return type === "work" ? (
      <BiBriefcase className="size-5" />
    ) : (
      <BiSolidGraduation className="size-5" />
    );
  };

  return (
    <div className="flex flex-col my-9 gap-4 relative py-4 max-w-[1400px] md:gap-6 md:py-6">
      <span
        className="from-primary/50 via-primary/20 to-primary/50 pointer-events-none absolute top-0 bottom-0 left-5 z-0 w-0.5 bg-gradient-to-b md:left-6 md:w-[3px]"
        aria-hidden="true"
      />
      {timelineData.map((item) => (
        <div
          className="relative flex w-full gap-2 md:gap-4"
          key={item.id}
        >
          <div className="bg-primary text-text-above-primary relative flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-full md:h-[48px] md:w-[48px]">
            {getIcon(item.type)}
          </div>
          <div className="w-0 min-w-0 flex-1">
            <div className="glow-container p-4 md:p-8">
              <div className="flex w-full flex-col gap-1">
                {item.link ? (
                  <StandardExternalLinkWithTracking
                    trackingData={{
                      action: tracking.action.open_experience_and_education,
                      category: tracking.category.home,
                      label: tracking.label.body,
                    }}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3>{item.title}</h3>
                  </StandardExternalLinkWithTracking>
                ) : (
                  <h3>{item.title}</h3>
                )}
                <h5>{item.subtitle}</h5>
                <time className="text-xs sm:text-base">{item.date}</time>
              </div>
              <div className="mt-4 flex w-full flex-col gap-3 md:flex-row md:gap-4">
                <div className="glow-container h-[48px] w-[48px] flex-shrink-0 self-start overflow-hidden rounded-lg md:h-[56px] md:w-[56px]">
                  <Image
                    className="object-contain bg-white"
                    src={item.image}
                    alt={item.title}
                    width={56}
                    height={56}
                    placeholder="blur"
                  />
                </div>

                <div className={"flex min-w-0 flex-1 flex-col gap-2"}>
                  <p className="m-0 text-left break-words hyphens-auto">
                    {item.description}
                  </p>
                  {item.features && (
                    <ul>
                      {item.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
