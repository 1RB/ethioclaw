"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

interface AnimateOnViewProps {
  children: ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  margin?: string;
  as?: "div" | "section" | "h1" | "h2" | "p" | "span";
}

const INITIAL_STATE: Record<string, React.CSSProperties> = {
  "fade-in-up": { opacity: 0, transform: "translateY(20px)" },
  "fade-in": { opacity: 0 },
  "fade-in-scale": { opacity: 0, transform: "scale(0.97)" },
  "fade-in-right": { opacity: 0, transform: "translateX(30px) scale(0.97)" },
  "scatter-in": { opacity: 0, transform: "scale(0.8)" },
};

export function AnimateOnView({
  children,
  className = "",
  animation = "fade-in-up",
  delay = 0,
  duration = 0.5,
  once = true,
  margin = "-100px",
  as: Tag = "div",
}: AnimateOnViewProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { rootMargin: margin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, margin]);

  const hiddenStyle = INITIAL_STATE[animation] ?? { opacity: 0 };

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={className}
      style={{
        ...(isVisible ? {} : hiddenStyle),
        animation: isVisible
          ? `${animation} ${duration}s ease-out ${delay}s both`
          : "none",
      }}
    >
      {children}
    </Tag>
  );
}
