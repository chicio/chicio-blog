import { convertToModelMessages, streamText, UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { createSystemPrompt } from "@/lib/chat/llm-prompt";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    // model: groq("llama-3.1-8b-instant"),
    messages: convertToModelMessages(messages),
    system: createSystemPrompt(),
    maxOutputTokens: 1000,
    temperature: 0.5
  });

  return result.toUIMessageStreamResponse();
}
