import Image from "next/image";
import { FC } from "react";
import { BiUser } from "react-icons/bi";


export const ChatAvatar: FC<{ isUser: boolean }> = ({ isUser }) => {
  const backgroundColor = isUser
    ? "bg-primary"
    : "bg-generalBackgroundLight";
  const color = isUser ? "text-text-above-primary" : "text-primary";

  return (
    <div
      className={`flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full ${backgroundColor} ${color} overflow-hidden`}
    >
      {isUser ? (
        <BiUser className="size-5" />
      ) : (
        <Image
          src="/images/chat-avatar.png"
          alt="Fabrizio Duroni"
          width={40}
          height={40}
        />
      )}
    </div>
  );
};
