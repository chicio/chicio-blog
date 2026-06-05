import { Button } from "@/components/design-system/atoms/buttons/button";
import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { Overlay } from "@/components/design-system/atoms/effects/overlay";
import { Variants } from "framer-motion";
import { FC } from "react";
import { MotionDiv } from "@/components/design-system/molecules/animation/motion-div";

const modalVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    scale: 1,
  },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
};

export interface ModalWithImageProps {
  imageUrl: string;
  imageAlt: string;
  onClick: () => void;
}

export const ModalWithImage: FC<ModalWithImageProps> = ({
  imageUrl,
  imageAlt,
  onClick,
}) => (
  <>
    <Overlay onClick={onClick} delay={0.15}>
      <MotionDiv
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed flex flex-col justify-center items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-8rounded-xl overflow-auto"
      >
        <ImageGlow
          fill={true}
          className="bg-general-background relative! mb-4 w-[95%]! sm:w-[60%]! h-[60%]! sm:max-h-[60%]! rounded-xl object-contain"
          src={imageUrl}
          alt={imageAlt}
          style={{ objectFit: "contain" }}
        />
        <Button className="relative text-primary-text" onClick={onClick}>
          <p>Close</p>
        </Button>
      </MotionDiv>
    </Overlay>
  </>
);
