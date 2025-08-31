import { createSystemPrompt } from "@/lib/chat/llm-prompt";
import { findRelevantContent } from "@/lib/chat/upstash-vector";
import { groq } from "@ai-sdk/groq";
import { convertToModelMessages, stepCountIs, streamText, tool, UIMessage } from "ai";
import z from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    // model: groq("llama-3.1-8b-instant"),
    messages: convertToModelMessages(messages),
    system: createSystemPrompt(),
    maxOutputTokens: 1000,
    temperature: 0.5,
    stopWhen: stepCountIs(5),
    tools: {
      getFabrizioDuroniBlogKnowledge: tool({
        description: `Retrieve relevant knowledge from Fabrizio Duroni website blog posts published on fabrizioduroni.it`,
        inputSchema: z.object({
          question: z.string().describe("The question to search for"),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
