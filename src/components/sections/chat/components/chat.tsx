"use client";

import { FC } from "react";
import { ChatInput } from "./chat-input";
import { useFabrizioChat } from "../hooks/useFabrizioChat";
import { ChatContainer } from "./chat-container";
import { ChatHeader } from "./chat-header";
import { MessagesContainer } from "./chat-messages";
import { ChatWelcome } from "./chat-welcome";
import { ChatMessage } from "./chat-message";
import { Markdown } from "./markdown";

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
