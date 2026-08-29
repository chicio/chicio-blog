import { ImageGlow } from "@/components/features/design-system-next/image-glow";

export const ManufacturerLogo: React.FC<{ logoUrl: string; name: string }> = ({ logoUrl, name }) => (
    <ImageGlow
        src={logoUrl}
        alt={`${name} logo`}
        width={100}
        height={56}
        className="mb-6 p-2 bg-black h-14 object-contain"
    />
);
