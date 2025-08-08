"use client";

import styled, { keyframes } from "styled-components";
import { Send, User } from "@styled-icons/boxicons-regular";
import { useFabrizioChat } from "@/components/chat/useFabrizioChat";
import { FC } from "react";
import { Heading1 } from "@/components/design-system/atoms/heading1";
import { Paragraph, paragraphStyle } from "@/components/design-system/atoms/paragraph";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";
import { Heading6 } from "@/components/design-system/atoms/heading6";
import Image from "next/image";
import { Markdown } from "@/components/chat/markdown";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ChatContainer = styled.div`
  height: calc(100vh - 100px);
  width: 100%;
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 ${(props) => props.theme.spacing[3]};
  position: relative;
`;

const ChatHeader = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.spacing[4]} ${(props) => props.theme.spacing[3]};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  z-index: 50;
  
  background: rgba(251, 251, 251, 0.8);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${(props) => props.theme.light.primaryColor}30,
      transparent
    );
  }

  ${mediaQuery.dark} {
    background: rgba(33, 34, 33, 0.80);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.4);
    
    &::after {
      background: linear-gradient(
        90deg,
        transparent,
        ${(props) => props.theme.dark.primaryColor}40,
        transparent
      );
    }
  }
  
  ${mediaQuery.maxWidth.sm} {
    padding: ${(props) => props.theme.spacing[3]} ${(props) => props.theme.spacing[2]};
  }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing[2]};
  margin-bottom: ${(props) => props.theme.spacing[1]};
  
  ${mediaQuery.maxWidth.sm} {
    gap: ${(props) => props.theme.spacing[1]};
    margin-bottom: ${(props) => props.theme.spacing[0]};
  }
`;

const StyledHeading1 = styled(Heading1)`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.light.primaryColor},
    ${(props) => props.theme.light.accentColor}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  position: relative;
  font-size: ${(props) => props.theme.fontSizes[9]};
  
  @supports not (-webkit-background-clip: text) {
    color: ${(props) => props.theme.light.primaryColor};
  }
  
  text-shadow: 0 0 20px ${(props) => props.theme.light.primaryColor}30;
  
  ${mediaQuery.dark} {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.dark.primaryColor},
      ${(props) => props.theme.dark.accentColor}
    );
    -webkit-background-clip: text;
    background-clip: text;
    text-shadow: 0 0 20px ${(props) => props.theme.dark.primaryColor}40;
    
    @supports not (-webkit-background-clip: text) {
      color: ${(props) => props.theme.dark.primaryColor};
    }
  }
  
  ${mediaQuery.maxWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[7]};
  }
`;

const StyledSubtitle = styled(Paragraph)`
  font-weight: 300;
  margin: 0;
  opacity: 0.8;
`;

const ChatIcon = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.light.primaryColor},
    ${(props) => props.theme.light.accentColor}
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px ${(props) => props.theme.light.primaryColor}40;
  animation: pulse 3s ease-in-out infinite;
  flex-shrink: 0;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  
  ${mediaQuery.dark} {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.dark.primaryColor},
      ${(props) => props.theme.dark.accentColor}
    );
    box-shadow: 0 4px 15px ${(props) => props.theme.dark.primaryColor}50;
  }
  
  ${mediaQuery.maxWidth.sm} {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 140px 0 ${(props) => props.theme.spacing[12]} 0;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[2]};
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  scrollbar-width: none;
  
  -ms-overflow-style: none;
  
  ${mediaQuery.maxWidth.sm} {
    padding: 180px 0 ${(props) => props.theme.spacing[10]} 0;
  }
  
  ${mediaQuery.maxWidth.xs} {
    padding: 220px 0 ${(props) => props.theme.spacing[10]} 0;
  }
`;

const MessageGroup = styled.div<{ $isUser: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${(props) => props.theme.spacing[2]};
  ${(props) => props.$isUser && "flex-direction: row-reverse;"}
  animation: ${fadeIn} 0.3s ease-out;
`;

const Avatar = styled.div<{ $isUser: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
  background: ${(props) => 
    props.$isUser 
      ? props.theme.light.primaryColor 
      : props.theme.light.generalBackgroundLight
  };
  color: ${(props) => 
    props.$isUser 
      ? props.theme.light.textAbovePrimaryColor 
      : props.theme.light.primaryTextColor
  };
  overflow: hidden;
  
  ${mediaQuery.dark} {
    background: ${(props) => 
      props.$isUser 
        ? props.theme.dark.primaryColor 
        : props.theme.dark.generalBackgroundLight
    };
    color: ${(props) => 
      props.$isUser 
        ? props.theme.dark.textAbovePrimaryColor 
        : props.theme.dark.primaryTextColor
    };
  }
  
  ${mediaQuery.maxWidth.sm} {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
`;

const MessageBubbleContainer = styled.div<{ $isUser: boolean }>`
  max-width: 70%;
  padding: 0 ${(props) => props.theme.spacing[2]};
  border-radius: 1rem;
  background: ${(props) => 
    props.$isUser 
      ? props.theme.light.primaryColor 
      : props.theme.light.generalBackgroundLight
  };
  color: ${(props) => 
    props.$isUser 
      ? props.theme.light.textAbovePrimaryColor 
      : props.theme.light.primaryTextColor
  } !important;
  ${(props) => props.$isUser && "margin-left: auto;"}
  margin: 0;
  ${paragraphStyle};

  ${mediaQuery.dark} {
    background: ${(props) => 
      props.$isUser 
        ? props.theme.dark.primaryColor 
        : props.theme.dark.generalBackgroundLight
    };
    color: ${(props) => 
      props.$isUser 
        ? props.theme.dark.textAbovePrimaryColor 
        : props.theme.dark.primaryTextColor
    } !important;
  }
  
  ${mediaQuery.maxWidth.sm} {
    max-width: 85%;
    padding: ${(props) => props.theme.spacing[2]};
  }
  
  ${mediaQuery.maxWidth.xs} {
    max-width: 90%;
  }
`;

const InputContainer = styled.form`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${(props) => props.theme.spacing[3]};
  background: rgba(251, 251, 251, 0.5);
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  border-top: 1px solid ${(props) => props.theme.light.dividerColor}20;
  z-index: 100;
  
  display: flex;
  justify-content: center;

  background: linear-gradient(
    90deg,
    transparent,
    ${(props) => props.theme.light.primaryColor}30,
    transparent
  );
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to top,
      rgba(251, 251, 251, 0.99) 0%,
      rgba(251, 251, 251, 0.9) 30%,
      rgba(251, 251, 251, 0.7) 60%,
      rgba(251, 251, 251, 0.3) 80%,
      rgba(251, 251, 251, 0.1) 100%
    );
    pointer-events: none;
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    pointer-events: none;
    z-index: -2;
  }
  
  ${mediaQuery.dark} {
    background: rgba(33, 34, 33, 0.6);
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
    border-top-color: ${(props) => props.theme.dark.dividerColor}20;
    
    &::before {
      background: linear-gradient(
        to top,
        rgba(33, 34, 33, 0.99) 0%,
        rgba(33, 34, 33, 0.9) 30%,
        rgba(33, 34, 33, 0.7) 60%,
        rgba(33, 34, 33, 0.3) 80%,
        rgba(33, 34, 33, 0.1) 100%
      );
    }
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  
  ${mediaQuery.dark} {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const ChatInput = styled.input`
  ${paragraphStyle};
  width: 100%;
  padding: ${(props) => props.theme.spacing[2]} ${(props) => props.theme.spacing[8]} ${(props) => props.theme.spacing[2]} ${(props) => props.theme.spacing[3]};
  border: 1px solid ${(props) => props.theme.light.dividerColor};
  border-radius: 1.5rem;
  outline: none;
  background: ${(props) => props.theme.light.generalBackground};
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: ${(props) => props.theme.light.primaryColor};
    box-shadow: 0 0 0 2px ${(props) => props.theme.light.primaryColor}25, 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background: ${(props) => props.theme.light.generalBackgroundLight};
    cursor: not-allowed;
  }

  ${mediaQuery.dark} {
    border-color: ${(props) => props.theme.dark.dividerColor};
    background: ${(props) => props.theme.dark.generalBackground};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    
    &:focus {
      border-color: ${(props) => props.theme.dark.primaryColor};
      box-shadow: 0 0 0 2px ${(props) => props.theme.dark.primaryColor}25, 0 2px 8px rgba(0, 0, 0, 0.4);
    }
    
    &:disabled {
      background: ${(props) => props.theme.dark.generalBackgroundLight};
    }
  }
`;

const SendButton = styled.button`
  position: absolute;
  right: ${(props) => props.theme.spacing[1]};
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  background: ${(props) => props.theme.light.primaryColor};
  color: ${(props) => props.theme.light.textAbovePrimaryColor};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.light.primaryColorDark};
    transform: translateY(-50%) scale(1.05);
  }

  &:disabled {
    background: ${(props) => props.theme.light.secondaryColor};
    cursor: not-allowed;
    transform: translateY(-50%);
  }
  
  ${mediaQuery.dark} {
    background: ${(props) => props.theme.dark.primaryColor};
    color: ${(props) => props.theme.dark.textAbovePrimaryColor};
    
    &:hover:not(:disabled) {
      background: ${(props) => props.theme.dark.primaryColorDark};
    }
    
    &:disabled {
      background: ${(props) => props.theme.dark.secondaryColor};
    }
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.spacing[3]} ${(props) => props.theme.spacing[3]};
  position: relative;
  
  background: rgba(251, 251, 251, 0.6); 
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  margin: ${(props) => props.theme.spacing[1]} 0;
  border: 1px solid ${(props) => props.theme.light.dividerColor}30;

  ${mediaQuery.dark} {
    background: rgba(33, 34, 33, 0.6);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    border-color: ${(props) => props.theme.dark.dividerColor}30;
  }
  
  ${mediaQuery.maxWidth.sm} {
    padding: ${(props) => props.theme.spacing[2]};
    margin: ${(props) => props.theme.spacing[0]} 0;
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

const ExampleQuestionsLabel = styled(Paragraph)`
  font-weight: 600;
  margin-bottom: ${(props) => props.theme.spacing[0]};
`;

const ExampleQuestion = styled.button`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${(props) => props.theme.light.dividerColor}30;
  border-radius: 1rem;
  padding: ${(props) => props.theme.spacing[3]} ${(props) => props.theme.spacing[4]};
  color: ${(props) => props.theme.light.primaryTextColor};
  cursor: pointer;
  text-align: left;
  font-size: ${(props) => props.theme.fontSizes[1]};
  font-family: inherit;
  font-weight: 500;
  line-height: 1.4;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing[2]};

  &:hover {
    background: linear-gradient(145deg, 
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
    background: linear-gradient(145deg, rgba(45, 45, 45, 0.9), rgba(33, 33, 33, 0.8));
    border-color: ${(props) => props.theme.dark.dividerColor}30;
    color: ${(props) => props.theme.dark.primaryTextColor};
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.1);
  }
  
  ${mediaQuery.maxWidth.sm} {
    padding: ${(props) => props.theme.spacing[2]} ${(props) => props.theme.spacing[3]};
    line-height: 1.3;
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

export const Chat: FC = () => {
  const {
    messages,
    input,
    handleSubmit,
    handleInputChange,
    exampleQuestions,
    handleExampleQuestionsSelection,
    messagesEndRef
  } = useFabrizioChat();

  return (
    <ChatContainer>
      <ChatHeader>
        <TitleGroup>
          <ChatIcon>💬</ChatIcon>
          <StyledHeading1>Chat with Fabrizio</StyledHeading1>
        </TitleGroup>
        <StyledSubtitle>
          Ask me anything about my work, projects, and software development expertise
        </StyledSubtitle>
      </ChatHeader>

      <MessagesContainer>
        {messages.length === 0 && (
          <WelcomeMessage>
            <Heading6>👋 Hey there! Ready to dive into my tech journey?</Heading6>
            <ExampleQuestions>
              <ExampleQuestionsLabel>Here are some conversation starters:</ExampleQuestionsLabel>
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
        )}

        {messages.map((message) => (
          <MessageGroup key={message.id} $isUser={message.role === "user"}>
            <Avatar $isUser={message.role === "user"}>
              {message.role === "user" ? (
                <User size={20} />
              ) : (
                <Image
                  src="/images/chat-avatar.png"
                  alt="Fabrizio Duroni"
                  width={40}
                  height={40}
                  style={{
                    borderRadius: '50%',
                    objectFit: 'cover',
                    objectPosition: '80% 80%'
                  }}
                />
              )}
            </Avatar>
            <MessageBubbleContainer $isUser={message.role === "user"}>
              {message.parts.map((part) => {
                if (part.type === "text") {
                  return (
                    <Markdown
                      key={`${message.id}-text`}
                      id={message.id}
                      content={part.text}
                    />
                  );
                }
              })}
            </MessageBubbleContainer>
          </MessageGroup>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer onSubmit={handleSubmit}>
        <InputWrapper>
          <ChatInput
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything about my work and experience..."
            disabled={false}
          />
          <SendButton type="submit" disabled={!input.trim()}>
            <Send size={16} />
          </SendButton>
        </InputWrapper>
      </InputContainer>
    </ChatContainer>
  );
}
