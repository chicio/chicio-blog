"use client";

import { useFabrizioChat } from "@/components/chat/useFabrizioChat";
import { FC } from "react";
import { Markdown } from "@/components/chat/markdown";
import { ChatContainer } from "@/components/chat/components/chat-container";
import { ChatHeader } from "@/components/chat/components/chat-header";
import { ChatWelcome } from "@/components/chat/components/chat-welcome";
import { ChatMessage } from "@/components/chat/components/chat-message";
import { ChatInput } from "./components/chat-input";
import { MessagesContainer } from "@/components/chat/components/chat-messages";

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

  const hasMessages = messages.length > 0;

  return (
    <ChatContainer>
      <ChatHeader hasMessages={hasMessages} />
      <MessagesContainer $hasMessages={hasMessages}>
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
