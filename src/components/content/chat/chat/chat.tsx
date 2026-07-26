"use client";

import { RedPillNoReflection } from "@/components/design-system/atoms/effects/pills";
import { ChatIcon } from "@/components/design-system/atoms/icons/chat-icon";
import { Markdown } from "@/components/design-system/atoms/typography/markdown";
import { ContentContainer } from "@/components/design-system/molecules/containers/content-container";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { ParagraphTitleWithIcon } from "@/components/design-system/molecules/typography/paragraph-title-with-icon";
import { BrandHeader } from "@/components/design-system/organism/header/brand-header";
import { Menu } from "@/components/design-system/organism/menu";
import { FC } from "react";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";
import { ChatWelcome } from "./chat-welcome";
import { useChatStore } from "./use-chat-store";
import { menuNavHrefs } from "@/components/features/content/nav-config";

export const Chat: FC = () => {
    const { state, effects } = useChatStore();
    const { setMessagesEndElement } = effects;

    return (
        <>
            <Menu navHrefs={menuNavHrefs} />
            <ContentContainer>
                {!state.hasMessages && (
                    <>
                        <BrandHeader big={false} />
                        <PageTitle>
                            <ParagraphTitleWithIcon icon={<ChatIcon />}>Ask the Oracle</ParagraphTitleWithIcon>
                        </PageTitle>
                        <p>Ask anything about my work, projects and code.</p>
                    </>
                )}
                <div className="hide-scrollbar pb-[calc(140px+env(safe-area-inset-bottom,0px))] flex flex-1 flex-col gap-3 overflow-visible pt-6 sm:pt-10 sm:pb-[140px]">
                    {!state.hasMessages && (
                        <ChatWelcome
                            exampleQuestions={state.exampleQuestions}
                            handleExampleQuestionsSelection={effects.handleExampleQuestionsSelection}
                        />
                    )}
                    {state.messages.map((message) => (
                        <ChatMessage isUser={message.role === "user"} key={message.id}>
                            {message.parts.map((part, idx) => {
                                switch (part.type) {
                                    case "text":
                                        return (
                                            <Markdown key={`${message.id}-text`} id={message.id} content={part.text} />
                                        );
                                    case "tool-getFabrizioDuroniBlogKnowledge": {
                                        const statusText =
                                            part.state === "output-available" ? `completed` : `in progress…`;
                                        return (
                                            <div className="my-3 mx-0 w-fit" key={`${message.id}-tool-${idx}`}>
                                                <RedPillNoReflection
                                                    pillBodyClassName="h-8"
                                                    pillLabelClassName="text-xs"
                                                >{`Blog Knowledge - ${statusText}`}</RedPillNoReflection>
                                            </div>
                                        );
                                    }
                                }
                            })}
                        </ChatMessage>
                    ))}
                    {state.error && (
                        <ChatMessage isUser={false}>
                            {state.error.message ||
                                "Sorry, I have encountered an error while trying to process your question. Please try again later."}
                        </ChatMessage>
                    )}
                    <div ref={setMessagesEndElement} />
                </div>
                <ChatInput
                    input={state.input}
                    handleSubmit={effects.handleSubmit}
                    handleInputChange={effects.handleInputChange}
                />
            </ContentContainer>
        </>
    );
};
