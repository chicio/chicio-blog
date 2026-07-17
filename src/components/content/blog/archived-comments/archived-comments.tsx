import { FC } from "react";
import { SectionHeading } from "@/components/design-system/molecules/typography/section-heading";
import { Chip } from "@/components/design-system/atoms/chip";
import { getArchivedCommentsBy } from "@/lib/content/comments/comments";
import { ArchivedCommentReply } from "@/types/content/comment";

export interface ArchivedCommentsProps {
    slug: string;
}

const formatArchivedDate = (date: string): string =>
    new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));

const ArchivedCommentEntry: FC<{ comment: ArchivedCommentReply }> = ({ comment }) => (
    <>
        <div className="mb-2 flex flex-wrap items-center gap-2">
            <Chip>{comment.author}</Chip>
            <time
                className="text-secondary-text text-sm"
                dateTime={comment.date}
            >
                {formatArchivedDate(comment.date)}
            </time>
        </div>
        {/* Safe here: message is static, repo-committed, offline pre-sanitized HTML (see src/content/blog/archived-comments.json) */}
        <div dangerouslySetInnerHTML={{ __html: comment.message }} />
    </>
);

export const ArchivedComments: FC<ArchivedCommentsProps> = ({ slug }) => {
    const comments = getArchivedCommentsBy(slug);

    if (comments.length === 0) {
        return null;
    }

    return (
        <div className="my-12">
            <SectionHeading
                title="Archived comments"
                description="Comments from the old comment system on this blog, preserved here as a read-only archive."
            />
            <div className="flex flex-col gap-6">
                {comments.map((comment) => (
                    <div
                        className="glow-container p-4"
                        key={`${comment.author}-${comment.date}`}
                    >
                        <ArchivedCommentEntry comment={comment} />
                        {comment.replies.length > 0 && (
                            <div className="border-accent-alpha-25 mt-4 flex flex-col gap-4 border-l-2 pl-4">
                                {comment.replies.map((reply) => (
                                    <ArchivedCommentEntry
                                        comment={reply}
                                        key={`${reply.author}-${reply.date}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
