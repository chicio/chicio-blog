import { InputField } from "@/components/design-system/atoms/typography/input-field";

import { ChangeEvent, FC, FormEvent } from "react";
import { BiSend } from "react-icons/bi";

export const ChatInput: FC<{
  input: string;
  handleSubmit: (e: FormEvent) => Promise<void>;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}> = ({ input, handleSubmit, handleInputChange }) => (
  <div
    className="container-fixed fixed right-0 bottom-0 left-0 z-50 p-3"
  >
    <form
      className="flex w-full flex-row items-center justify-center gap-2"
      onSubmit={handleSubmit}
    >
      <InputField
        className="flex-9/12 pt-3 pr-9 pb-3 pl-4 backdrop-blur-2xl"
        value={input}
        onChange={handleInputChange}
        placeholder="Ask me anything..."
      />
      <button
        className="bg-primary text-text-above-primary top-1/2 flex h-[36px] w-[36px] transform items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
        type="submit"
        disabled={!input.trim()}
      >
        <BiSend size={16} />
      </button>
    </form>
  </div>
);
