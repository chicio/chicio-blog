import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { ChangeEvent, FormEvent } from "react";

const { mockUseChat, mockSendMessage } = vi.hoisted(() => ({
    mockUseChat: vi.fn(),
    mockSendMessage: vi.fn(),
}));

vi.mock("@ai-sdk/react", () => ({
    useChat: mockUseChat,
}));

import { useChatStore } from "./use-chat-store";

const buildSubmitEvent = (): FormEvent => ({ preventDefault: vi.fn() }) as unknown as FormEvent;

describe("useChatStore", () => {
    beforeEach(() => {
        mockSendMessage.mockClear();
        mockUseChat.mockReturnValue({
            messages: [],
            sendMessage: mockSendMessage,
            error: undefined,
        });
    });

    describe("handleSubmit", () => {
        it("sends the message and clears the input for a normal message", async () => {
            const { result } = renderHook(() => useChatStore());

            act(() => {
                result.current.effects.handleInputChange({
                    target: { value: "Tell me about Fabrizio" },
                } as unknown as ChangeEvent<HTMLInputElement>);
            });

            await act(async () => {
                await result.current.effects.handleSubmit(buildSubmitEvent());
            });

            expect(mockSendMessage).toHaveBeenCalledWith({ text: "Tell me about Fabrizio" });
            expect(result.current.state.input).toBe("");
        });

        it("does not call sendMessage and clears the input when the spoon phrase is submitted", async () => {
            const { result } = renderHook(() => useChatStore());

            act(() => {
                result.current.effects.handleInputChange({
                    target: { value: "there is no spoon" },
                } as unknown as ChangeEvent<HTMLInputElement>);
            });

            await act(async () => {
                await result.current.effects.handleSubmit(buildSubmitEvent());
            });

            expect(mockSendMessage).not.toHaveBeenCalled();
            expect(result.current.state.input).toBe("");
        });

        it("matches the spoon phrase regardless of case or spacing", async () => {
            const { result } = renderHook(() => useChatStore());

            act(() => {
                result.current.effects.handleInputChange({
                    target: { value: "  THERE   IS NO   SPOON  " },
                } as unknown as ChangeEvent<HTMLInputElement>);
            });

            await act(async () => {
                await result.current.effects.handleSubmit(buildSubmitEvent());
            });

            expect(mockSendMessage).not.toHaveBeenCalled();
        });

        it("does nothing for an empty (whitespace only) input", async () => {
            const { result } = renderHook(() => useChatStore());

            act(() => {
                result.current.effects.handleInputChange({
                    target: { value: "   " },
                } as unknown as ChangeEvent<HTMLInputElement>);
            });

            await act(async () => {
                await result.current.effects.handleSubmit(buildSubmitEvent());
            });

            expect(mockSendMessage).not.toHaveBeenCalled();
        });
    });
});
