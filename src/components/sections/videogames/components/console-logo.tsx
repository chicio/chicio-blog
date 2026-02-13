import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";

export const ConsoleLogo: React.FC<{ logoUrl: string; name: string }> = ({
  logoUrl,
  name,
}) => (
  <ImageGlow
    src={logoUrl}
    alt={`${name} logo`}
    width={100}
    height={50}
    className="mb-6 object-cover"
  />
);
