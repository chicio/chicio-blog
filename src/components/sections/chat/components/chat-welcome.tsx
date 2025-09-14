import { Button } from "@/components/design-system/atoms/buttons/button";
import { GlassmorphismBackground } from "@/components/design-system/atoms/effects/glassmorphism-background";
import { FC } from "react";

type ChatWelcomeProps = {
  exampleQuestions: string[];
  handleExampleQuestionsSelection: (question: string) => void;
};

export const ChatWelcome: FC<ChatWelcomeProps> = ({
  exampleQuestions,
  handleExampleQuestionsSelection,
}) => (
  <GlassmorphismBackground>
    <h4>👋 Hey there! Ready to dive into my tech journey?</h4>
    <div className='mt-3 sm:mt-2 flex flex-col gap-2 sm:gap-1'>
      <p className='text-shadow-md text-sm sm:text-base'>
        Here are some conversation starters:
      </p>
      {exampleQuestions.map((question) => (
        <Button
          className="flex items-center gap-2"
          key={question}
          onClick={() => handleExampleQuestionsSelection(question)}
          type="button"
        >
          <div className="flex-shrink-0">💬</div>
          <span className="flex-1 leading-normal text-xs sm:text-sm text-primary-text">{question}</span>
        </Button>
      ))}
    </div>
  </GlassmorphismBackground>
);
