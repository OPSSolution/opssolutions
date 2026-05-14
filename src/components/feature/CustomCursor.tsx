import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorState = "default" | "pointer" | "card" | "text" | "drag";

const INTERACTIVE_SELECTORS = [
  "button",
  "a",
  "[role='button']",
  "[data-cursor='pointer']",
  "input",
  "textarea",
  "select",
  "label",
  "summary",
];

const CARD_SELECTORS = [
  "[data-cursor='card']",
  ".group.cursor-pointer",
  "article",
];

const TEXT_SELECTORS = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "span", "[data-cursor='text']"];

function getState(target: Element | null): CursorState {
  if (!target) return "default";
  const el = target as HTMLElement;

  for (const sel of INTERACTIVE_SELECTORS) {
    if (el.closest(sel)) return "pointer";
  }
  for (const sel of CARD_SELECTORS) {
    if (el.closest(sel)) return "card";
  }
  return "default";
}

const ringSize: Record<CursorState, number> = {
  default: 36,
  pointer: 52,
  card: 64,
  text: 2,
  drag: 72,
};

const ringOpacity: Record<CursorState, number> = {
  default: 0.55,
  pointer: 0.85,
  card: 0.4,
  text: 0.8,
  drag: 0.6,
};

const ringBg: Record<CursorState, string> = {
  default: "transparent",
  pointer: "rgba(185,255,75,0.12)",
  card: "rgba(185,255,75,0.06)",
  text: "transparent",
  drag: "rgba(185,255,75,0.1)",
};

const dotSize: Record<CursorState, number> = {
  default: 6,
  pointer: 4,
  card: 5,
  text: 2,
  drag: 4,
};

const cursorLabel: Record<CursorState, string | null> = {
  default: null,
  pointer: null,
  card: "view",
  text: null,
  drag: "drag",
};

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const rafRef = useRef<number | null>(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ring follows with spring lag
  const ringX = useSpring(mouseX, { stiffness: 120, damping: 22, mass: 0.6 });
  const ringY = useSpring(mouseY, { stiffness: 120, damping: 22, mass: 0.6 });

  // Dot is nearly instant
  const dotX = useSpring(mouseX, { stiffness: 900, damping: 35 });
  const dotY = useSpring(mouseY, { stiffness: 900, damping: 35 });

  useEffect(() => {
    // Only enable on non-touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        if (!isVisible) setIsVisible(true);
        const state = getState(e.target as Element);
        setCursorState(state);
      });
    };

    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);
    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, mouseX, mouseY]);

  const rSize = ringSize[cursorState];
  const dSize = dotSize[cursorState];
  const label = cursorLabel[cursorState];

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden="true">
      {/* Ring */}
      <motion.div
        className="absolute top-0 left-0 rounded-full border border-accent/70 flex items-center justify-center"
        style={{
          x: ringX,
          y: ringY,
          width: rSize,
          height: rSize,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? ringOpacity[cursorState] : 0,
          background: ringBg[cursorState],
          scale: isClicking ? 0.75 : 1,
          borderColor: cursorState === "pointer"
            ? "rgba(185,255,75,0.9)"
            : cursorState === "card"
            ? "rgba(185,255,75,0.5)"
            : "rgba(185,255,75,0.6)",
          borderWidth: cursorState === "card" ? "1.5px" : "1px",
        }}
        animate={{
          width: rSize,
          height: rSize,
          scale: isClicking ? 0.75 : 1,
        }}
        transition={{
          width: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
          height: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 0.12, ease: "easeOut" },
          opacity: { duration: 0.15 },
        }}
      >
        {/* Label inside ring for card state */}
        {label && (
          <motion.span
            className="text-accent text-[9px] font-bold font-mono tracking-widest uppercase select-none"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>

      {/* Dot */}
      <motion.div
        className="absolute top-0 left-0 rounded-full bg-accent"
        style={{
          x: dotX,
          y: dotY,
          width: dSize,
          height: dSize,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? (cursorState === "card" ? 0.9 : 1) : 0,
        }}
        animate={{ width: dSize, height: dSize }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Click ripple */}
      {isClicking && (
        <motion.div
          className="absolute top-0 left-0 rounded-full border border-accent/40 pointer-events-none"
          style={{
            x: dotX,
            y: dotY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 80, height: 80, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
    </div>
  );
}