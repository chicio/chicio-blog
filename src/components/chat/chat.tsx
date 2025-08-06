"use client";

import styled, { keyframes } from "styled-components";
import { Bot, Send, User } from "@styled-icons/boxicons-regular";
import { useFabrizioChat } from "@/components/chat/useFabrizioChat";
import { FC, useEffect, useRef } from "react";
import { Heading1 } from "@/components/design-system/atoms/heading1";
import { Heading3 } from "@/components/design-system/atoms/heading3";
import { Paragraph } from "@/components/design-system/atoms/paragraph";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";
import { Heading4 } from "@/components/design-system/atoms/heading4";
import { Heading6 } from "@/components/design-system/atoms/heading6";

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
  padding-top: ${(props) => props.theme.spacing[5]}; /* Reduced spacing from menu */
  
  @media (max-width: 768px) {
    padding-top: ${(props) => props.theme.spacing[3]}; /* Even less on mobile */
  }
`;

const ChatHeader = styled.div`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing[6]}; /* Reduced from spacing[11] */
  padding: ${(props) => props.theme.spacing[6]} ${(props) => props.theme.spacing[4]}; /* Reduced vertical padding */
  position: relative;
  
  /* Subtle gradient background */
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.light.generalBackground} 0%,
    ${(props) => props.theme.light.generalBackgroundLight} 50%,
    ${(props) => props.theme.light.generalBackground} 100%
  );
  border-radius: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  
  /* Decorative elements - more prominent for main header */
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(
      45deg,
      ${(props) => props.theme.light.primaryColor}30,
      ${(props) => props.theme.light.accentColor}40,
      ${(props) => props.theme.light.primaryColor}30
    );
    border-radius: 1.5rem;
    z-index: -1;
    opacity: 0.8; /* More visible for main header */
  }
  
  @media (prefers-color-scheme: dark) {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.dark.generalBackground} 0%,
      ${(props) => props.theme.dark.generalBackgroundLight} 50%,
      ${(props) => props.theme.dark.generalBackground} 100%
    );
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    
    &::before {
      background: linear-gradient(
        45deg,
        ${(props) => props.theme.dark.primaryColor}40,
        ${(props) => props.theme.dark.accentColor}50,
        ${(props) => props.theme.dark.primaryColor}40
      );
    }
  }
  
  @media (max-width: 768px) {
    margin-bottom: ${(props) => props.theme.spacing[4]};
    padding: ${(props) => props.theme.spacing[4]} ${(props) => props.theme.spacing[3]};
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
  margin-bottom: ${(props) => props.theme.spacing[3]};
  position: relative;
  
  /* Fallback for browsers that don't support background-clip */
  @supports not (-webkit-background-clip: text) {
    color: ${(props) => props.theme.light.primaryColor};
  }
  
  /* Add a subtle glow effect */
  text-shadow: 0 0 30px ${(props) => props.theme.light.primaryColor}40;
  
  @media (prefers-color-scheme: dark) {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.dark.primaryColor},
      ${(props) => props.theme.dark.accentColor}
    );
    -webkit-background-clip: text;
    background-clip: text;
    text-shadow: 0 0 30px ${(props) => props.theme.dark.primaryColor}60;
    
    @supports not (-webkit-background-clip: text) {
      color: ${(props) => props.theme.dark.primaryColor};
    }
  }
`;

const StyledSubtitle = styled(Paragraph)`
  font-size: ${(props) => props.theme.fontSizes[4]};
  color: ${(props) => props.theme.light.secondaryTextColor};
  font-weight: 300;
  margin: 0;
  opacity: 0.9;
  
  @media (prefers-color-scheme: dark) {
    color: ${(props) => props.theme.dark.secondaryTextColor};
  }
`;

const ChatIcon = styled.div`
  width: 50px; /* Slightly smaller */
  height: 50px;
  margin: 0 auto ${(props) => props.theme.spacing[3]}; /* Reduced margin */
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.light.primaryColor},
    ${(props) => props.theme.light.accentColor}
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem; /* Slightly smaller */
  box-shadow: 0 6px 20px ${(props) => props.theme.light.primaryColor}30;
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); } /* Reduced floating distance */
  }
  
  @media (prefers-color-scheme: dark) {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.dark.primaryColor},
      ${(props) => props.theme.dark.accentColor}
    );
    box-shadow: 0 6px 20px ${(props) => props.theme.dark.primaryColor}40;
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    margin-bottom: ${(props) => props.theme.spacing[2]};
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${(props) => props.theme.spacing[2]} 0 ${(props) => props.theme.spacing[12]} 0; /* Reduced padding */
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[2]}; /* Reduced gap */
  scroll-behavior: smooth;
  
  /* Hide scrollbar for webkit browsers (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  
  /* Hide scrollbar for IE and older Edge */
  -ms-overflow-style: none;
  
  @media (max-width: 768px) {
    padding: ${(props) => props.theme.spacing[1]} 0 ${(props) => props.theme.spacing[10]} 0;
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
  
  @media (prefers-color-scheme: dark) {
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
`;

const MessageBubbleContent = styled(Paragraph)<{ $isUser: boolean }>`
  max-width: 70%;
  padding: ${(props) => props.theme.spacing[2]} ${(props) => props.theme.spacing[3]};
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
  white-space: pre-wrap;
  ${(props) => props.$isUser && "margin-left: auto;"}
  margin: 0; /* Override default paragraph margin */

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
`;

const InputContainer = styled.form`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${(props) => props.theme.spacing[3]};
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid ${(props) => props.theme.light.dividerColor};
  z-index: 100;
  
  /* Container for centering the input */
  display: flex;
  justify-content: center;
  
  @media (prefers-color-scheme: dark) {
    background: rgba(33, 34, 33, 0.8);
    border-top-color: ${(props) => props.theme.dark.dividerColor};
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
`;

const ChatInput = styled.input`
  width: 100%;
  padding: ${(props) => props.theme.spacing[2]} ${(props) => props.theme.spacing[8]} ${(props) => props.theme.spacing[2]} ${(props) => props.theme.spacing[3]};
  border: 1px solid ${(props) => props.theme.light.dividerColor};
  border-radius: 1.5rem;
  font-size: ${(props) => props.theme.fontSizes[2]};
  outline: none;
  background: ${(props) => props.theme.light.generalBackground};
  color: ${(props) => props.theme.light.primaryTextColor};
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
  
  @media (prefers-color-scheme: dark) {
    border-color: ${(props) => props.theme.dark.dividerColor};
    background: ${(props) => props.theme.dark.generalBackground};
    color: ${(props) => props.theme.dark.primaryTextColor};
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
  
  @media (prefers-color-scheme: dark) {
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
  padding: ${(props) => props.theme.spacing[5]} ${(props) => props.theme.spacing[4]}; /* Reduced padding */
  position: relative;
  
  /* Same style as main header but more subtle */
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.light.generalBackground} 0%,
    ${(props) => props.theme.light.generalBackgroundLight} 50%,
    ${(props) => props.theme.light.generalBackground} 100%
  );
  border-radius: 1.2rem; /* Slightly smaller radius */
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.04); /* Softer shadow */
  margin: ${(props) => props.theme.spacing[2]} 0;
  
  /* Subtle decorative border - less prominent than main header */
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(
      45deg,
      ${(props) => props.theme.light.primaryColor}15,
      ${(props) => props.theme.light.accentColor}20,
      ${(props) => props.theme.light.primaryColor}15
    );
    border-radius: 1.2rem;
    z-index: -1;
    opacity: 0.5; /* More subtle than main header */
  }

  ${mediaQuery.dark} {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.dark.generalBackground} 0%,
      ${(props) => props.theme.dark.generalBackgroundLight} 50%,
      ${(props) => props.theme.dark.generalBackground} 100%
    );
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.2);
    
    &::before {
      background: linear-gradient(
        45deg,
        ${(props) => props.theme.dark.primaryColor}20,
        ${(props) => props.theme.dark.accentColor}25,
        ${(props) => props.theme.dark.primaryColor}20
      );
    }
  }
  
  @media (max-width: 768px) {
    padding: ${(props) => props.theme.spacing[4]} ${(props) => props.theme.spacing[3]};
    margin: ${(props) => props.theme.spacing[1]} 0;
  }
`;

const WelcomeDescription = styled(Paragraph)`
  margin-top: ${(props) => props.theme.spacing[2]}; /* Reduced spacing */
  margin-bottom: ${(props) => props.theme.spacing[3]};
  
  @media (max-width: 768px) {
    margin-top: ${(props) => props.theme.spacing[1]};
    margin-bottom: ${(props) => props.theme.spacing[2]};
  }
`;

const ExampleQuestions = styled.div`
  margin-top: ${(props) => props.theme.spacing[3]}; /* Reduced spacing */
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[2]}; /* Reduced gap */
  
  @media (max-width: 768px) {
    margin-top: ${(props) => props.theme.spacing[2]};
    gap: ${(props) => props.theme.spacing[1]};
  }
`;

const ExampleQuestionsLabel = styled(Paragraph)`
  font-weight: 600;
  margin-bottom: ${(props) => props.theme.spacing[1]}; /* Reduced margin */
  
  @media (max-width: 768px) {
    margin-bottom: ${(props) => props.theme.spacing[0]};
  }
`;

const ExampleQuestion = styled.button`
  background: rgba(255, 255, 255, 0.6); /* Slightly more subtle */
  backdrop-filter: blur(8px); /* Slightly less blur */
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid ${(props) => props.theme.light.dividerColor};
  border-radius: 0.8rem; /* Slightly smaller radius than main header */
  padding: ${(props) => props.theme.spacing[2]} ${(props) => props.theme.spacing[3]}; /* Reduced padding */
  color: ${(props) => props.theme.light.primaryTextColor};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: ${(props) => props.theme.fontSizes[1]}; /* Slightly smaller font */
  font-family: inherit;
  line-height: 1.4; /* Tighter line height */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06); /* Softer shadow */
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.15), /* More subtle shimmer */
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    background: rgba(63, 81, 181, 0.85); /* Slightly less intense */
    color: ${(props) => props.theme.light.textAbovePrimaryColor};
    border-color: ${(props) => props.theme.light.primaryColor};
    transform: translateY(-1px); /* Reduced lift */
    box-shadow: 0 6px 20px rgba(63, 81, 181, 0.25); /* Softer hover shadow */

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
  
  @media (prefers-color-scheme: dark) {
    background: rgba(33, 34, 33, 0.7); /* Slightly more subtle */
    border-color: ${(props) => props.theme.dark.dividerColor};
    color: ${(props) => props.theme.dark.primaryTextColor};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
    
    &::before {
      background: linear-gradient(
        90deg,
        transparent,
        rgba(63, 81, 181, 0.25),
        transparent
      );
    }
    
    &:hover {
      background: rgba(63, 81, 181, 0.85);
      color: ${(props) => props.theme.dark.textAbovePrimaryColor};
      border-color: ${(props) => props.theme.dark.primaryColor};
      box-shadow: 0 6px 20px rgba(63, 81, 181, 0.35);
    }
  }
  
  @media (max-width: 768px) {
    padding: ${(props) => props.theme.spacing[2]};
    font-size: ${(props) => props.theme.fontSizes[0]}; /* Even smaller on mobile */
    line-height: 1.3;
    border-radius: 0.6rem;
  }
`;

export const Chat: FC = () => {
  const { messages, input, handleSubmit, handleInputChange, exampleQuestions, handleExampleQuestionsSelection } = useFabrizioChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatIcon>💬</ChatIcon>
        <StyledHeading1>Chat with Fabrizio</StyledHeading1>
        <StyledSubtitle>
          Ask me anything about my work, projects, and software development expertise
        </StyledSubtitle>
      </ChatHeader>

      <MessagesContainer>
        {messages.length === 0 && (
          <WelcomeMessage>
            <Heading6>👋 Hey there! Ready to dive into my tech journey?</Heading6>
            <WelcomeDescription>
              This AI-powered chat knows all about my professional experience,
              projects, and technical skills. Don&#39;t hold back—ask me anything!
            </WelcomeDescription>
            <ExampleQuestions>
              <ExampleQuestionsLabel>Here are some conversation starters:</ExampleQuestionsLabel>
              {exampleQuestions.map((question) => (
                <ExampleQuestion
                  key={question}
                  onClick={() => handleExampleQuestionsSelection(question)}
                  type="button"
                >
                  💬 {question}
                </ExampleQuestion>
              ))}
            </ExampleQuestions>
          </WelcomeMessage>
        )}

        {messages.map((message) => (
          <MessageGroup key={message.id} $isUser={message.role === "user"}>
            <Avatar $isUser={message.role === "user"}>
              {message.role === "user" ? <User size={20} /> : <Bot size={20} />}
            </Avatar>
            <MessageBubbleContent $isUser={message.role === "user"}>
              {message.parts.map((part) => {
                switch (part.type) {
                  case "text":
                    return part.text;
                }
              })}
            </MessageBubbleContent>
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
