import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";

const exampleQuestions = [
  "Which programming languages does Fabrizio Duroni know?",
  "Tell me about Fabrizio’s experience at lastminute.com.",
  "Which open source projects has Fabrizio created?",
  "Talk about Fabrizio’s experience with React Native."
];

export const useFabrizioChat = () => {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const [hasStartedConversation, setHasStartedConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0 && !hasStartedConversation) {
      setHasStartedConversation(true);
    }
  }, [messages, hasStartedConversation]);

  useEffect(() => {
    if (hasStartedConversation && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      const isLastMessageDone = lastMessage.role === 'user' ||
        lastMessage.parts.some(part => part.type === 'text' && part.state === 'done');

      if (isLastMessageDone) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [messages, hasStartedConversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    await sendMessage({ text: input });

    setHasStartedConversation(true);
    setInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleExampleQuestionsSelection = async (question: string) => {
    // Mark conversation as started when user clicks example question
    setHasStartedConversation(true);
    await sendMessage({ text: question });
  };

  return {
    messages,
    input,
    exampleQuestions,
    handleExampleQuestionsSelection,
    handleSubmit,
    handleInputChange,
    messagesEndRef,
  };
}
