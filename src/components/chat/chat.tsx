"use client";

import styled, { keyframes } from "styled-components";
import { Bot, Send, User } from "@styled-icons/boxicons-regular";
import { useFabrizioChat } from "@/components/chat/useFabrizioChat";
import { FC } from "react";

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
`;

const ChatHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e1e5e9;
`;

const ChatTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ChatSubtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageGroup = styled.div<{ $isUser: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
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
  background: ${(props) => (props.$isUser ? "#007bff" : "#f8f9fa")};
  color: ${(props) => (props.$isUser ? "white" : "#333")};
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background: ${(props) => (props.$isUser ? "#007bff" : "#f8f9fa")};
  color: ${(props) => (props.$isUser ? "white" : "#333")};
  white-space: pre-wrap;
  line-height: 1.5;
  ${(props) => props.$isUser && "margin-left: auto;"}
`;

const InputContainer = styled.form`
  display: flex;
  gap: 0.75rem;
  padding: 1rem 0;
  border-top: 1px solid #e1e5e9;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  &:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  margin: 1rem 0;
`;

export const Chat: FC = () => {
  const { messages, input, handleSubmit, handleInputChange } =
    useFabrizioChat();

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>Ask Fabrizio</ChatTitle>
        <ChatSubtitle>
          Ask me anything about my work, projects, or expertise in software
          development
        </ChatSubtitle>
      </ChatHeader>

      <MessagesContainer>
        {messages.length === 0 && (
          <WelcomeMessage>
            👋 Hi! I&#39;m here to answer questions about Fabrizio&#39;s work
            and expertise. Feel free to ask about his blog posts, projects, or
            technical knowledge!
          </WelcomeMessage>
        )}

        {messages.map((message) => (
          <MessageGroup key={message.id} $isUser={message.role === "user"}>
            <Avatar $isUser={message.role === "user"}>
              {message.role === "user" ? <User size={20} /> : <Bot size={20} />}
            </Avatar>
            <MessageBubble $isUser={message.role === "user"}>
              {message.parts.map((part) => {
                switch (part.type) {
                  case "text":
                    return part.text;
                }
              })}
            </MessageBubble>
          </MessageGroup>
        ))}
      </MessagesContainer>

      <InputContainer onSubmit={handleSubmit}>
        <ChatInput
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about Fabrizio's work, blog posts, or technical expertise..."
          disabled={false}
        />
        <SendButton type="submit" disabled={!input.trim()}>
          <Send size={16} />
          Send
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
}
