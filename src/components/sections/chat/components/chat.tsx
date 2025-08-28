"use client";

import { FC } from "react";
import { useFabrizioChat } from "../hooks/useFabrizioChat";
import { GenericHeader } from "../../../design-system/organism/header/generic-header";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";
import { MessagesContainer } from "./chat-messages";
import { ChatWelcome } from "./chat-welcome";
import { Markdown } from "./markdown";
import { MatrixHeaderBackground } from "@/components/design-system/molecules/effects/matrix-header-background";
import { ContentContainer } from "@/components/design-system/molecules/containers/content-container";
import { tracking } from "@/types/tracking";
import { Menu } from "@/components/design-system/organism/menu";
import { ChatButton } from "@/components/design-system/molecules/buttons/chat-button";

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
    <>
      <Menu trackingCategory={tracking.category.chat} />
      <ContentContainer>
        {!hasMessages && <MatrixHeaderBackground big={false} />}
        <GenericHeader
          title="Chat with Fabrizio"
          subtitle="Ask me anything about my work, projects, and software development expertise"
          logo={<ChatButton />}
          visible={!hasMessages}
        />
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
      </ContentContainer>
    </>
  );
};
