"use client";

import { slugs } from "@/types/slug";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatIcon } from "../../atoms/icons/chat-icon";

export const FloatingChatButton = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/chat")) {
    return null;
  }

  return (
    <div className="fixed bottom-3 right-3 md:bottom-5 md:right-9 z-50">
      <Link aria-label="chat" target="_blank" href={slugs.chat} passHref >
        <ChatIcon />
      </Link>
    </div>
  );
};
