"use client";

import { RedPill } from "@/components/design-system/atoms/effects/pills";
import { ChatIcon } from "@/components/design-system/atoms/icons/chat-icon";
import { ContentContainer } from "@/components/design-system/molecules/containers/content-container";
import { MatrixHeaderBackground } from "@/components/design-system/molecules/effects/matrix-header-background";
import { Menu } from "@/components/design-system/organism/menu";
import { tracking } from "@/types/tracking";
import { FC } from "react";
import { GenericHeader } from "../../../design-system/organism/header/generic-header";
import { useFabrizioChat } from "../hooks/useFabrizioChat";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";
import { MessagesContainer } from "./chat-messages";
import { ToolStatusPill } from "./chat-tools";
import { ChatWelcome } from "./chat-welcome";
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
    <>
      <Menu trackingCategory={tracking.category.chat} />
      <ContentContainer>
        {!hasMessages && <MatrixHeaderBackground big={false} />}
        <GenericHeader
          title="Chat with Fabrizio"
          subtitle="Ask me anything about my work, projects, and software development expertise"
          logo={<ChatIcon />}
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
              {message.parts.map((part, idx) => {
                switch (part.type) {
                  case "text":
                    return (
                      <Markdown
                        key={`${message.id}-text`}
                        id={message.id}
                        content={part.text}
                      />
                    );
                  case "tool-getFabrizioDuroniBlogKnowledge": {
                    const statusText =
                      part.state === "output-available"
                        ? `completed`
                        : `in progress…`;
                    return (
                      <ToolStatusPill key={`${message.id}-tool-${idx}`}>
                        <RedPill>{`Blog Knowledge - ${statusText}`}</RedPill>
                      </ToolStatusPill>
                    );
                  }
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
