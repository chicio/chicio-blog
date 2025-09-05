import { FC, PropsWithChildren } from "react";
import { ChatAvatar } from "./chat-avatar";

export const ChatMessage: FC<
  PropsWithChildren<{
    isUser: boolean;
  }>
> = ({ isUser, children }) => {
  const flexDirection = isUser ? "flex-row-reverse" : "flex-row";
  const background = isUser ? "bg-secondary" : "bg-general-background-light";
  const color = isUser ? "chat-message-user" : "text-primary-text";

  return (
    <div className={`flex ${flexDirection} items-start gap-2 animate-opacity`}>
      <ChatAvatar isUser={isUser} />
      <div className={`max-w-[80%] md:max-w-[70%] gap-2 py-3 px-4 rounded-xl text-left text-base leading-normal flex flex-col-reverse ${background} ${color}`}>{children}</div>
    </div>
  );
};
