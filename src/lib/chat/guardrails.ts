import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export interface GuardrailResult {
    safe: boolean;
    blockedReason?: string;
}

const INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
    /disregard\s+(all\s+)?(previous|prior|above)\s+instructions/i,
    /forget\s+(all\s+)?(previous|prior|above)\s+instructions/i,
    /you\s+are\s+now\s+(?:a\s+|an\s+|my\s+)?(?:different|another|new|unrestricted|unfiltered|evil|jailbroken|free|not|no\s+longer|DAN\b)/i,
    /act\s+as\s+(if\s+you\s+are\s+|a\s+)?(?!Fabrizio)/i,
    /pretend\s+(you\s+are|to\s+be)\s+/i,
    /do\s+anything\s+now/i,
    /jailbreak/i,
    /override\s+(your\s+)?(system\s+)?prompt/i,
    /\[system\]/i,
    /<\|system\|>/i,
];

const TOPIC_RELEVANCE_SYSTEM_PROMPT = `You are a strict topic classifier for Fabrizio Duroni's portfolio chatbot.
Reply with ONLY the single word "yes" or "no".

Reply "yes" if the message is about any of:
- Fabrizio Duroni (his career, skills, projects, experience, education, personality, jokes)
- Fabrizio's personal life (his hobbies, interests, relationship, girlfriend, partner, family, where he lives, lifestyle)
- Software development, programming, technology, computer science
- His blog posts, articles, or technical writing
- General greetings, introductions, or small talk
- Questions about what the chatbot can help with

Reply "no" if the message asks about completely unrelated topics (sports, cooking, weather, politics, entertainment)
or requests the assistant to perform tasks unrelated to answering questions about Fabrizio (e.g., writing code for the user, translating text, solving math problems).`;

export const checkPromptInjection = (message: string): GuardrailResult => {
    const matched = INJECTION_PATTERNS.some((pattern) => pattern.test(message));

    if (matched) {
        return {
            safe: false,
            blockedReason:
                "I detected an attempt to override my instructions. I'm here to answer questions about Fabrizio Duroni — feel free to ask me anything about his work, projects, or experience.",
        };
    }

    return { safe: true };
};

export const checkInputSafety = async (message: string): Promise<GuardrailResult> => {
    try {
        const { text } = await generateText({
            model: groq("meta-llama/llama-prompt-guard-2-86m"),
            messages: [{ role: "user", content: message }],
        });

        const isSafe = !text.trim().toLowerCase().includes("malicious");

        if (!isSafe) {
            return {
                safe: false,
                blockedReason:
                    "I detected a potential prompt injection attempt. I'm here to answer questions about Fabrizio Duroni — feel free to ask me anything about his work, projects, or experience.",
            };
        }

        return { safe: true };
    } catch (error) {
        console.warn("Prompt Guard safety check failed, allowing request:", error);
        return { safe: true };
    }
};

export const checkTopicRelevance = async (message: string): Promise<GuardrailResult> => {
    try {
        const { text } = await generateText({
            model: groq("llama-3.1-8b-instant"),
            system: TOPIC_RELEVANCE_SYSTEM_PROMPT,
            prompt: message,
            maxOutputTokens: 5,
            temperature: 0,
        });

        const isOnTopic = text.trim().toLowerCase().startsWith("yes");

        if (!isOnTopic) {
            return {
                safe: false,
                blockedReason:
                    "That topic is outside my scope. I'm Fabrizio's portfolio assistant — ask me about his skills, experience, projects, or anything software development related!",
            };
        }

        return { safe: true };
    } catch (error) {
        // Fail open — if the relevance model is unavailable, allow the request through
        console.warn("Topic relevance check failed, allowing request:", error);
        return { safe: true };
    }
};

export const runGuardrails = async (message: string): Promise<GuardrailResult> => {
    const injectionResult = checkPromptInjection(message);

    if (!injectionResult.safe) {
        return injectionResult;
    }

    const [safetyResult, relevanceResult] = await Promise.all([checkInputSafety(message), checkTopicRelevance(message)]);

    if (!safetyResult.safe) {
        return safetyResult;
    }

    if (!relevanceResult.safe) {
        return relevanceResult;
    }

    return { safe: true };
};
