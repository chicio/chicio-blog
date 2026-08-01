import { Label } from "chicio-blog";
import { BiEnvelope, BiMessageDetail, BiUser } from "react-icons/bi";

export const Default = () => (
    <div className="flex">
        <Label id="name" value="Name" icon={<BiUser size={20} />} />
    </div>
);

export const WithoutIcon = () => (
    <div className="flex">
        <Label id="reading-time" value="Reading time" />
    </div>
);

export const ContactFormLabels = () => (
    <div className="flex flex-col gap-6">
        <Label id="name" value="Name" icon={<BiUser size={20} />} />
        <Label id="email" value="Email" icon={<BiEnvelope size={20} />} />
        <Label id="message" value="Message" icon={<BiMessageDetail size={20} />} />
    </div>
);
