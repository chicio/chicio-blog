import { createSystemPrompt } from "@/lib/chat/llm-prompt";
import { runGuardrails } from "@/lib/chat/guardrails";
import { findRelevantContent } from "@/lib/upstash/upstash-vector";
import { groq } from "@ai-sdk/groq";
import { convertToModelMessages, stepCountIs, streamText, tool, UIMessage } from "ai";
import z from "zod";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const lastUserMessage = messages.findLast((m) => m.role === "user");
  const lastUserText =
    lastUserMessage?.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join(" ")
      .trim() ?? "";

  if (lastUserText) {
    const guardrailResult = await runGuardrails(lastUserText);

    if (!guardrailResult.safe) {
      return new Response(guardrailResult.blockedReason, { status: 400 });
    }
  }

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    // model: groq("llama-3.1-8b-instant"),
    messages: await convertToModelMessages(messages),
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
