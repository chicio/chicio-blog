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
        <div className={`flex ${flexDirection} animate-opacity items-start gap-2`}>
            <ChatAvatar isUser={isUser} />
            <div
                className={`flex max-w-[80%] flex-col-reverse gap-2 rounded-xl px-4 py-3 text-left text-base leading-normal md:max-w-[70%] ${background} ${color}`}
            >
                {children}
            </div>
        </div>
    );
};
