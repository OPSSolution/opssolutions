import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const IMAGE_URL =
  "https://readdy.ai/api/search-image?query=artificial%20intelligence%20content%20generation%20interface%2C%20neural%20network%20visualization%20with%20glowing%20nodes%20on%20dark%20background%2C%20AI%20text%20generation%20UI%20with%20code%20and%20language%20models%2C%20futuristic%20machine%20learning%20platform%2C%20lime%20green%20accent%20colors%2C%20cinematic%20digital%20art&width=800&height=600&seq=portfolio_05&orientation=landscape";

// Reduced from 14x9 (126 cells) → 7x5 (35 cells) for GPU performance
const COLS = 7;
const ROWS = 5;
const TOTAL = COLS * ROWS;

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 43758.5453123;
  return x - Math.floor(x);
}

const CELLS = Array.from({ length: TOTAL }, (_, idx) => {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const bpX = COLS === 1 ? 50 : (col / (COLS - 1)) * 100;
  const bpY = ROWS === 1 ? 50 : (row / (ROWS - 1)) * 100;
  const cx = Math.abs(col - COLS / 2) / (COLS / 2);
  const cy = Math.abs(row - ROWS / 2) / (ROWS / 2);
  const distFromCenter = Math.sqrt(cx * cx + cy * cy);
  const baseDelay = seededRandom(idx * 7 + 3) * 0.85;
  const delay = baseDelay * (0.35 + distFromCenter * 0.65) + 0.05;
  const startScale = 0.55 + seededRandom(idx * 3) * 0.35;
  const startRz = (seededRandom(idx * 11) - 0.5) * 38;
  return { col, row, bpX, bpY, delay, startScale, startRz };
});

interface Props {
  triggered?: boolean;
  hovered?: boolean;
}

export default function AuraAIPixelImage({ triggered = false, hovered = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-40px" });
  const shouldAnimate = inView || triggered;
  const [glitching, setGlitching] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!shouldAnimate || hasAnimated.current) return;
    const lastDelay = Math.max(...CELLS.map((c) => c.delay)) + 0.65;
    const t = setTimeout(() => { hasAnimated.current = true; }, lastDelay * 1000);
    return () => clearTimeout(t);
  }, [shouldAnimate]);

  // Hover → glitch flash
  useEffect(() => {
    if (!hasAnimated.current || !hovered) return;
    setGlitching(true);
    const t = setTimeout(() => setGlitching(false), 160);
    return () => clearTimeout(t);
  }, [hovered]);

  // Periodic auto-glitch every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasAnimated.current || hovered) return;
      setGlitching(true);
      setTimeout(() => setGlitching(false), 130);
    }, 6000);
    return () => clearInterval(interval);
  }, [hovered]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ perspective: "900px" }}
    >
      <div
        className="absolute inset-0"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {CELLS.map((cell, idx) => (
          <motion.div
            key={idx}
            style={{
              backgroundImage: `url(${IMAGE_URL})`,
              backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
              backgroundPosition: `${cell.bpX}% ${cell.bpY}%`,
              backgroundRepeat: "no-repeat",
            }}
            initial={{ opacity: 0, scale: cell.startScale, rotateZ: cell.startRz, filter: "blur(5px) brightness(2)" }}
            animate={
              !shouldAnimate
                ? {}
                : glitching
                ? { opacity: 0.15, scale: 0.72, rotateZ: cell.startRz * 0.45, filter: "blur(2px) brightness(2.5)" }
                : { opacity: 1, scale: 1, rotateZ: 0, filter: "blur(0px) brightness(1)" }
            }
            transition={
              glitching
                ? { duration: 0.1 }
                : {
                    duration: 0.48,
                    delay: hasAnimated.current ? cell.delay * 0.28 : cell.delay,
                    ease: [0.16, 1, 0.3, 1],
                    opacity: {
                      duration: 0.35,
                      delay: hasAnimated.current ? cell.delay * 0.22 : cell.delay + 0.02,
                    },
                  }
            }
          />
        ))}
      </div>

      {/* Subtle scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(185,255,75,0.035) 0px, rgba(185,255,75,0.035) 1px, transparent 1px, transparent 4px)",
          opacity: 0.5,
        }}
      />

      {/* Glitch flash */}
      {glitching && (
        <div
          className="absolute inset-0 pointer-events-none z-30"
          style={{ background: "rgba(185,255,75,0.1)", mixBlendMode: "screen" }}
        />
      )}

      {/* Entry resolution scan */}
      {shouldAnimate && (
        <motion.div
          className="absolute inset-x-0 pointer-events-none z-20"
          style={{
            height: "3px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(185,255,75,0.7) 30%, rgba(255,255,255,0.9) 50%, rgba(185,255,75,0.7) 70%, transparent 100%)",
            filter: "blur(1px)",
          }}
          initial={{ top: "-3%", opacity: 0 }}
          animate={{ top: ["-3%", "103%"], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 0.8,
            delay: Math.max(...CELLS.map((c) => c.delay)) * 0.78,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}