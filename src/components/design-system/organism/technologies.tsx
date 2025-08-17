import { FloatingDownArrow } from "@/components/design-system/molecules/floating-down-arrow";

// ...existing imports and styled components...

export const Technologies: FC<TechnologiesProps> = ({ author }) => {
  // ...existing logic...

  return (
    <TechnologiesContainer>
      <ContentWrapper>
        {/* ...existing content... */}
      </ContentWrapper>
      <FloatingDownArrow />
    </TechnologiesContainer>
  );
};
