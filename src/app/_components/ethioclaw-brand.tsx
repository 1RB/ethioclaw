"use client";

import Link from "next/link";
import { EthioClawLogo } from "./ethioclaw-logo";

interface EthioClawBrandProps {
  size?: "sm" | "md" | "lg";
  logoLink?: string;
}

const SIZES = {
  sm: { logo: 20, text: "text-xs", gap: "gap-2" },
  md: { logo: 28, text: "text-sm", gap: "gap-2" },
  lg: { logo: 40, text: "text-xl", gap: "gap-3" },
} as const;

export function EthioClawBrand({ size = "md", logoLink }: EthioClawBrandProps) {
  const s = SIZES[size];

  const logo = <EthioClawLogo size={s.logo} />;

  return (
    <div className={`flex items-center ${s.gap}`}>
      {logoLink ? (
        <Link href={logoLink}>{logo}</Link>
      ) : (
        logo
      )}
      <span className={`${s.text} font-bold leading-none tracking-tight uppercase`}>
        ETHIOCLAW
      </span>
    </div>
  );
}
