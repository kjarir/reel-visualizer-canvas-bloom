import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 30,
  duration = 0.6,
  ease = "power3.out",
}) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll(".split-char");
    gsap.fromTo(
      chars,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration,
        ease,
        stagger: delay / 1000,
      }
    );
  }, [text, delay, duration, ease]);

  return (
    <span
      ref={ref}
      className={className}
      style={{
        display: "inline-block",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {text.split("").map((char, i) => (
        <span key={i} className="split-char" style={{ display: "inline-block" }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

export default SplitText; 