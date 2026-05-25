"use client";

interface EthioClawLogoProps {
  size?: number;
  className?: string;
}

export function EthioClawLogo({ size = 40, className }: EthioClawLogoProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        {/* Three claw scratch marks — sharp, precise, brutalist */}
        <line
          x1="24"
          y1="88"
          x2="40"
          y2="12"
          stroke="#39ff14"
          strokeWidth="8"
          strokeLinecap="square"
        />
        <line
          x1="48"
          y1="88"
          x2="58"
          y2="28"
          stroke="#39ff14"
          strokeWidth="8"
          strokeLinecap="square"
        />
        <line
          x1="70"
          y1="88"
          x2="76"
          y2="44"
          stroke="#39ff14"
          strokeWidth="7"
          strokeLinecap="square"
        />
      </svg>
    </div>
  );
}
