import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { groq } from "@ai-sdk/groq";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
