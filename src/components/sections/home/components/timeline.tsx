import { StandardExternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-external-link-with-tracking";
import { tracking } from "@/types/configuration/tracking";
import { Variants } from "framer-motion";
import Image from "next/image";
import { FC } from "react";
import { BiBriefcase, BiSolidGraduation } from "react-icons/bi";
import { MotionDiv } from "@/components/design-system/molecules/animation/motion-div";
import { timelineData } from "@/types/home/timeline";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.1,
    },
  },
};

export const Timeline: FC = () => {

  const getIcon = (type: "work" | "education") => {
    return type === "work" ? (
      <BiBriefcase className="size-5" />
    ) : (
      <BiSolidGraduation className="size-5" />
    );
  };

  return (
    <MotionDiv
      className="flex flex-col gap-4 relative py-4 max-w-[1400px] md:gap-6 md:py-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <span
        className="from-primary/50 via-primary/20 to-primary/50 pointer-events-none absolute top-0 bottom-0 left-5 z-0 w-0.5 bg-gradient-to-b md:left-6 md:w-[3px]"
        aria-hidden="true"
      />
      {timelineData.map((item) => (
        <MotionDiv
          className="relative flex w-full gap-2 md:gap-4"
          key={item.id}
          variants={itemVariants}
          whileHover="hover"
        >
          <div className="bg-primary text-text-above-primary relative flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-full md:h-[48px] md:w-[48px]">
            {getIcon(item.type)}
          </div>
          <MotionDiv className="w-0 min-w-0 flex-1" variants={cardVariants}>
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
          </MotionDiv>
        </MotionDiv>
      ))}
    </MotionDiv>
  );
};
