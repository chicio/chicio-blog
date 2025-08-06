import { useChat } from "@ai-sdk/react";
import { useState } from "react";

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

  return { messages, input, handleSubmit, handleInputChange };
}
