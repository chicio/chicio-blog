"use client";

import { slugs } from "@/types/configuration/slug";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatIcon } from "../../atoms/icons/chat-icon";

export const FloatingChatButton = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/chat")) {
    return null;
  }

  return (
    <div className="z-40">
      <Link aria-label="chat" target="_blank" href={slugs.chat} passHref >
        <ChatIcon />
      </Link>
    </div>
  );
};
