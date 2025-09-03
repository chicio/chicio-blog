import styled, { TransientProps } from "styled-components";
import { motion, Variants } from "framer-motion";
import { FC } from "react";
import { glassmorphism } from "@/components/design-system/atoms/effects/glassmorphism";
import { Overlay } from "@/components/design-system/atoms/effects/overlay";
import { CallToActionExternal } from "@/components/design-system/atoms/call-to-actions/call-to-action-external";

const zIndex = 400;

interface ModalContainerProps {
  zIndex: number;
}

const ModalWrapper = styled.div<{ $zIndex: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${(props) => props.$zIndex};
`;

const ModalContainer = styled(motion.div)<TransientProps<ModalContainerProps>>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: min(95vw, 700px);
  max-width: 95vw;
  height: auto;
  max-height: 90vh;
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
  background-color: ${(props) => props.theme.colors.generalBackground};
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
    <Overlay onClick={onClick} delay={0.15}>
      <ModalWrapper $zIndex={zIndex}>
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
      </ModalWrapper>
    </Overlay>
  </>
);
