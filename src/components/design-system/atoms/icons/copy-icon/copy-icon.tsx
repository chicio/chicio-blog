import { MdContentCopy, MdCheck, MdErrorOutline } from "react-icons/md";

export const CopyIcon = () => <MdContentCopy className="size-4" title="Copy code" />;

export const CopiedIcon = () => <MdCheck className="size-4" title="Copied!" />;

export const CopyErrorIcon = () => <MdErrorOutline className="size-4" title="Copy failed" />;
