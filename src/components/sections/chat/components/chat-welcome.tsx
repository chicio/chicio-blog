import { Button } from "@/components/design-system/atoms/buttons/button";
import { GlassmorphismBackground } from "@/components/design-system/atoms/effects/glassmorphism-background";
import { Heading6 } from "@/components/design-system/atoms/typography/heading6";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import { FC } from "react";
import styled from "styled-components";
import { ChatSubtitle } from "./chat-subtitle";

const ExampleQuestions = styled.div`
  margin-top: ${(props) => props.theme.spacing[2]};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[1]};

  ${mediaQuery.maxWidth.sm} {
    margin-top: ${(props) => props.theme.spacing[1]};
    gap: ${(props) => props.theme.spacing[0]};
  }
`;

const QuestionText = styled.span`
  flex: 1;
  line-height: 1.4;
  font-size: ${(props) => props.theme.fontSizes[1]};
  font-family: inherit;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primaryTextColor};

  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[2]};
  }
`;

const QuestionIcon = styled.span`
  font-size: 1.2em;
  opacity: 0.8;
  flex-shrink: 0;

  ${mediaQuery.maxWidth.sm} {
    font-size: 1em;
  }
`;

type ChatWelcomeProps = {
  exampleQuestions: string[];
  handleExampleQuestionsSelection: (question: string) => void;
};

export const ChatWelcome: FC<ChatWelcomeProps> = ({
  exampleQuestions,
  handleExampleQuestionsSelection,
}) => (
  <GlassmorphismBackground>
    <Heading6>👋 Hey there! Ready to dive into my tech journey?</Heading6>
    <ExampleQuestions>
      <ChatSubtitle>Here are some conversation starters:</ChatSubtitle>
      {exampleQuestions.map((question) => (
        <Button
          key={question}
          onClick={() => handleExampleQuestionsSelection(question)}
          type="button"
        >
          <QuestionIcon>💬</QuestionIcon>
          <QuestionText>{question}</QuestionText>
        </Button>
      ))}
    </ExampleQuestions>
  </GlassmorphismBackground>
);
