import { Button, GlassmorphismBackground } from "matrix-design-system";
import { FC } from "react";

type ChatWelcomeProps = {
    exampleQuestions: string[];
    handleExampleQuestionsSelection: (question: string) => () => void;
};

export const ChatWelcome: FC<ChatWelcomeProps> = ({ exampleQuestions, handleExampleQuestionsSelection }) => (
    <GlassmorphismBackground>
        <h4>👋 Hey there! Ready to dive into my tech journey?</h4>
        <div className="mt-3 flex flex-col gap-2 sm:mt-2 sm:gap-1">
            <p className="text-sm text-shadow-md sm:text-base">Here are some conversation starters:</p>
            {exampleQuestions.map((question) => (
                <Button
                    className="my-2 flex items-center gap-4"
                    key={question}
                    onClick={handleExampleQuestionsSelection(question)}
                    type="button"
                >
                    <div className="flex-shrink-0">💬</div>
                    <span className="text-primary-text flex-1 text-xs leading-normal sm:text-sm">{question}</span>
                </Button>
            ))}
        </div>
    </GlassmorphismBackground>
);
