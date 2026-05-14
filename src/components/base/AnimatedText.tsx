import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  mode?: "words" | "chars";
  as?: Tag;
  inViewRef?: React.RefObject<HTMLElement>;
  triggerOnce?: boolean;
  margin?: string;
}

const wordVariants = {
  hidden: { y: "115%", opacity: 0, rotateX: -25 },
  visible: (custom: number) => ({
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      duration: 0.72,
      delay: custom,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const charVariants = {
  hidden: { y: "120%", opacity: 0 },
  visible: (custom: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.55,
      delay: custom,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function AnimatedText({
  text,
  className = "",
  delay = 0,
  stagger = 0.085,
  mode = "words",
  as: Tag = "span",
  triggerOnce = true,
  margin = "-60px",
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const inView = useInView(containerRef as React.RefObject<Element>, { once: triggerOnce, margin });

  if (mode === "words") {
    // Split preserving <span> children — we split by word but preserve className-rich inline spans
    // Simple word split — split by whitespace, render each word in an overflow-hidden wrapper
    const words = text.split(" ");

    return (
      <Tag
        ref={containerRef as React.RefObject<HTMLElement & HTMLHeadingElement>}
        className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}
        style={{ perspective: "600px" }}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="overflow-hidden inline-block pb-[0.08em]">
            <motion.span
              className="inline-block"
              custom={delay + i * stagger}
              variants={wordVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </Tag>
    );
  }

  // chars mode
  const chars = text.split("");
  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLElement & HTMLHeadingElement>}
      className={`inline-flex flex-wrap ${className}`}
    >
      {chars.map((char, i) => (
        char === " " ? (
          <span key={`space-${i}`}>&nbsp;</span>
        ) : (
          <span key={`${char}-${i}`} className="overflow-hidden inline-block">
            <motion.span
              className="inline-block"
              custom={delay + i * stagger}
              variants={charVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {char}
            </motion.span>
          </span>
        )
      ))}
    </Tag>
  );
}