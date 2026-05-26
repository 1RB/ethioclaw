import Image from "next/image";

const MONOCHROME_LOGOS = new Set(["github", "notion", "linear"]);

interface LogoImageProps {
  slug: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  loading?: "eager" | "lazy";
}

export function LogoImage({
  slug,
  alt = "",
  width = 24,
  height = 24,
  className = "",
  style,
  priority,
  loading,
}: LogoImageProps) {
  const needsInvert = MONOCHROME_LOGOS.has(slug);
  return (
    <Image
      src={`/images/logos/${slug}.svg`}
      alt={alt}
      width={width}
      height={height}
      className={`${needsInvert ? "dark:invert" : ""} ${className}`.trim()}
      style={style}
      priority={priority}
      loading={loading}
    />
  );
}
