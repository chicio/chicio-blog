import { useChat } from "@ai-sdk/react";
import { useState } from "react";

const exampleQuestions = [
  "Which programming languages does Fabrizio Duroni know?",
  "Tell me about Fabrizio’s experience at lastminute.com.",
  "Which open source projects has Fabrizio created?",
  "Talk about Fabrizio’s experience with React Native."
];

export const useFabrizioChat = () => {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    await sendMessage({ text: input });

    setInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleExampleQuestionsSelection = async (question: string) => {
    await sendMessage({ text: question });
  };

  return { messages, input, exampleQuestions, handleExampleQuestionsSelection, handleSubmit, handleInputChange };
}
