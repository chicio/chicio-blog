import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";

const exampleQuestions = [
  "Which programming languages does Fabrizio Duroni know?",
  "Tell me about Fabrizio’s experience at lastminute.com.",
  "Which open source projects has Fabrizio created?",
  "Talk about Fabrizio’s experience with React Native."
];

export const useFabrizioChat = () => {
  const { messages, sendMessage, error } = useChat();
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    const messageText = input;
    setInput('');

    await sendMessage({ text: messageText });

    setHasStartedConversation(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleExampleQuestionsSelection = async (question: string) => {
    setHasStartedConversation(true);
    await sendMessage({ text: question });
  };

  return {
    messages,
    error,
    input,
    exampleQuestions,
    handleExampleQuestionsSelection,
    handleSubmit,
    handleInputChange,
    messagesEndRef,
  };
}
