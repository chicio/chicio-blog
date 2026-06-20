"use client";

import { useChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ComponentStore } from "@/types/component-store";

const exampleQuestions = [
    "Which programming languages does Fabrizio Duroni know?",
    "Tell me about Fabrizio's experience at lastminute.com.",
    "Which open source projects has Fabrizio created?",
    "Talk about Fabrizio's experience with React Native.",
];

interface ChatState {
    messages: UIMessage[];
    error: Error | undefined;
    input: string;
    exampleQuestions: string[];
}

interface ChatEffects {
    handleSubmit: (e: FormEvent) => Promise<void>;
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleExampleQuestionsSelection: (question: string) => () => Promise<void>;
    setMessagesEndElement: (el: HTMLDivElement | null) => void;
}

export const useChatStore = (): ComponentStore<ChatState, ChatEffects> => {
    const { messages, sendMessage, error } = useChat();
    const [input, setInput] = useState("");
    const [messagesEndEl, setMessagesEndElement] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (messages.length === 0) {
            return;
        }

        const lastMessage = messages[messages.length - 1];
        const isLastMessageDone =
            lastMessage.role === "user" ||
            lastMessage.parts.some((part) => part.type === "text" && part.state === "done");

        if (isLastMessageDone) {
            setTimeout(() => {
                messagesEndEl?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [messages, messagesEndEl]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!input.trim()) {
            return;
        }

        const messageText = input;
        setInput("");

        await sendMessage({ text: messageText });
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleExampleQuestionsSelection = (question: string) => async () => {
        await sendMessage({ text: question });
    };

    return {
        state: { messages, error, input, exampleQuestions },
        effects: { handleSubmit, handleInputChange, handleExampleQuestionsSelection, setMessagesEndElement },
    };
};
