import { FC, PropsWithChildren } from "react";

interface InteractiveBlockProps {
    title: string;
}

export const InteractiveBlock: FC<PropsWithChildren<InteractiveBlockProps>> = ({ title, children }) => (
    <div className="my-8">
        <div className="glow-container border-accent rounded-2xl border-2 px-4 py-6 shadow-lg">
            <div className="flex flex-col items-center gap-4">
                <span className="text-accent mb-2 text-center text-lg font-bold tracking-widest uppercase">
                    {title}
                </span>
                {children}
            </div>
        </div>
    </div>
);
