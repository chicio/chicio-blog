import { FC, ReactNode } from "react";

export interface EmptyStateProps {
    icon: ReactNode;
    /** What was being looked for, in the plural: "games" reads "No games found for ...". */
    subject: string;
    query: string;
}

export const EmptyState: FC<EmptyStateProps> = ({ icon, subject, query }) => (
    <div className="text-secondary flex flex-col items-center gap-3 py-16">
        <span className="text-accent text-5xl text-shadow-lg" aria-hidden="true">
            {icon}
        </span>
        <p className="text-accent text-shadow-lg">
            No {subject} found for &ldquo;{query}&rdquo;.
        </p>
    </div>
);
