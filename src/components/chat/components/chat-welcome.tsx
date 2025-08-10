import styled from "styled-components";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";
import { Heading6 } from "@/components/design-system/atoms/heading6";
import { ChatSubtitle } from "@/components/chat/components/chat-subtitle";
import { FC } from "react";

const WelcomeMessage = styled.div`
  text-align: center;
  position: relative;
  background: rgba(251, 251, 251, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.10);
  overflow: visible;
  margin: ${(props) => props.theme.spacing[1]} 
    ${(props) => props.theme.spacing[1]};
  padding: ${(props) => props.theme.spacing[3]}
    ${(props) => props.theme.spacing[3]};
  border: 1px solid ${(props) => props.theme.light.dividerColor}30;
  background: ${(props) => props.theme.light.generalBackgroundLight};

  ${mediaQuery.dark} {
    background: ${(props) => props.theme.dark.generalBackgroundLight};
    border-color: ${(props) => props.theme.dark.dividerColor}30;
  }

  ${mediaQuery.maxWidth.sm} {
    padding: ${(props) => props.theme.spacing[2]};
  }
`;

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

const ExampleQuestion = styled.button`
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0.7)
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${(props) => props.theme.light.dividerColor}30;
  border-radius: 1rem;
  padding: ${(props) => props.theme.spacing[3]}
    ${(props) => props.theme.spacing[4]};
  color: ${(props) => props.theme.light.primaryTextColor};
  cursor: pointer;
  text-align: left;
  font-size: ${(props) => props.theme.fontSizes[1]};
  font-family: inherit;
  font-weight: 500;
  line-height: 1.6;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 1px 4px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing[2]};

  &:hover {
    background: linear-gradient(
      145deg,
      ${(props) => props.theme.light.primaryColor}F0,
      ${(props) => props.theme.light.accentColor}F0
    );
    color: ${(props) => props.theme.light.textAbovePrimaryColor};
    border-color: ${(props) => props.theme.light.primaryColor}40;
    box-shadow: 0 6px 18px rgba(63, 81, 181, 0.12);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  ${mediaQuery.dark} {
    background: linear-gradient(
      145deg,
      rgba(45, 45, 45, 0.9),
      rgba(33, 33, 33, 0.8)
    );
    border-color: ${(props) => props.theme.dark.dividerColor}30;
    color: ${(props) => props.theme.dark.primaryTextColor};
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.2),
      0 1px 4px rgba(0, 0, 0, 0.1);
  }

  ${mediaQuery.maxWidth.sm} {
    padding: ${(props) => props.theme.spacing[2]}
      ${(props) => props.theme.spacing[3]};
    border-radius: 0.8rem;
  }
`;

const QuestionText = styled.span`
  flex: 1;
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
  <WelcomeMessage>
    <Heading6>👋 Hey there! Ready to dive into my tech journey?</Heading6>
    <ExampleQuestions>
      <ChatSubtitle>Here are some conversation starters:</ChatSubtitle>
      {exampleQuestions.map((question) => (
        <ExampleQuestion
          key={question}
          onClick={() => handleExampleQuestionsSelection(question)}
          type="button"
        >
          <QuestionIcon>💬</QuestionIcon>
          <QuestionText>{question}</QuestionText>
        </ExampleQuestion>
      ))}
    </ExampleQuestions>
  </WelcomeMessage>
);
