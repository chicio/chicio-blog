import { FC, PropsWithChildren } from "react";

interface InteractiveBlockProps {
    title: string;
}

export const InteractiveBlock: FC<PropsWithChildren<InteractiveBlockProps>> = ({ title, children }) => (
  <div className="my-8">
    <div className="glow-container px-4 py-6 shadow-lg rounded-2xl border-2 border-accent">
      <div className="flex flex-col items-center gap-4">
        <span className="text-accent text-center text-lg font-bold tracking-widest uppercase mb-2">
          {title}
        </span>
        {children}
      </div>
    </div>
  </div>
);