"use client";

import styled from "styled-components";
import { useFabrizioChat } from "@/components/chat/useFabrizioChat";
import { FC } from "react";
import { Markdown } from "@/components/chat/markdown";
import { ChatContainer } from "@/components/chat/components/chat-container";
import { ChatHeader } from "@/components/chat/components/chat-header";
import { ChatWelcome } from "@/components/chat/components/chat-welcome";
import { ChatMessage } from "@/components/chat/components/chat-message";
import { ChatInput } from "./components/chat-input";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 160px 0 calc(140px + env(safe-area-inset-bottom, 0px)) 0;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[3]};
  scroll-behavior: smooth;

  ${mediaQuery.minWidth.sm} {
    padding: 160px 0 ${(props) => props.theme.spacing[12]} 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const Chat: FC = () => {
  const {
    messages,
    error,
    input,
    handleSubmit,
    handleInputChange,
    exampleQuestions,
    handleExampleQuestionsSelection,
    messagesEndRef,
  } = useFabrizioChat();

  return (
    <ChatContainer>
      <ChatHeader />
      <MessagesContainer>
        {messages.length === 0 && (
          <ChatWelcome
            exampleQuestions={exampleQuestions}
            handleExampleQuestionsSelection={handleExampleQuestionsSelection}
          />
        )}
        {messages.map((message) => (
          <ChatMessage isUser={message.role === "user"} key={message.id}>
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
          </ChatMessage>
        ))}
        {error && (
          <ChatMessage isUser={false}>
            Sorry, I have encountered an error while trying to processing your
            question. Please try again later.
          </ChatMessage>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <ChatInput
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />
    </ChatContainer>
  );
};
