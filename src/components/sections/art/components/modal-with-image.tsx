import styled, { TransientProps } from "styled-components";
import { motion, Variants } from "framer-motion";
import { FC } from "react";
import { glassmorphism } from "@/components/design-system/atoms/glassmorphism";
import { Overlay } from "@/components/design-system/atoms/overlay";
import { CallToActionExternal } from "@/components/design-system/atoms/call-to-action-external";

const zIndex = 400;

interface ModalContainerProps {
  zIndex: number;
}

const ModalContainer = styled(motion.div)<TransientProps<ModalContainerProps>>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: min(95vw, 700px);
  max-width: 95vw;
  height: auto;
  max-height: 90vh;
  z-index: ${(props) => props.$zIndex};
  padding: ${(props) => props.theme.spacing[4]};
  ${glassmorphism};
  box-shadow: 0 8px 32px 0 rgba(0, 255, 70, 0.25);
  border-radius: 24px;
  overflow: auto;
  @media (max-width: 600px) {
    width: 98vw;
    max-width: 98vw;
    padding: ${(props) => props.theme.spacing[2]};
  }
`;

const modalVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    scale: 1,
  },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
};

const ModalImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 16px;
  margin-bottom: 16px;
`;

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
    <Overlay zIndex={zIndex} onClick={onClick} delay={0.15}>
      <ModalContainer
        $zIndex={zIndex}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <ModalImage src={imageUrl} alt={imageAlt} />
        <CallToActionExternal onClick={onClick}>Close</CallToActionExternal>
      </ModalContainer>
    </Overlay>
  </>
);
