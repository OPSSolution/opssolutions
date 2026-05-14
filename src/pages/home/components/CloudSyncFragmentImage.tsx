import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

const IMAGE_URL =
  "https://readdy.ai/api/search-image?query=cloud%20infrastructure%20architecture%20diagram%20on%20dark%20background%2C%20server%20rooms%20with%20glowing%20cables%20and%20LED%20lights%2C%20data%20center%20technology%20visualization%2C%20network%20topology%20with%20green%20connection%20nodes%2C%20futuristic%20server%20management%20interface&width=800&height=600&seq=portfolio_04&orientation=landscape";

const COLS = 4;
const ROWS = 3;
const TOTAL = COLS * ROWS;

// Sequential fly-in order — snake pattern so pieces build row by row
// but with a slight shuffle to feel more organic
const FLY_ORDER = (() => {
  const order: number[] = [];
  for (let r = 0; r < ROWS; r++) {
    const rowTiles = Array.from({ length: COLS }, (_, c) => r * COLS + c);
    if (r % 2 === 1) rowTiles.reverse(); // snake direction
    rowTiles.forEach((idx) => order.push(idx));
  }
  return order;
})();

// For each tile index, precompute: how many tiles fly in before it
const SEQ_POSITION = Array.from({ length: TOTAL }, (_, idx) => FLY_ORDER.indexOf(idx));

// Each tile gets a unique launch position (from outside the viewport)
const LAUNCH_POSITIONS = Array.from({ length: TOTAL }, (_, i) => {
  const angle = ((i * 137.5) % 360) * (Math.PI / 180); // golden-angle spread
  const dist = 340 + ((i * 73) % 180); // 340–520px away
  return {
    tx: Math.cos(angle) * dist,
    ty: Math.sin(angle) * dist - 60,
    tz: -180 - ((i * 53) % 200),
    rx: ((i * 47) % 50) - 25,
    ry: ((i * 31) % 50) - 25,
    rz: ((i * 23) % 36) - 18,
  };
});

// Hover shatter — tiles explode outward from their grid position
const HOVER_SCATTER = Array.from({ length: TOTAL }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const cx = (col - (COLS - 1) / 2) / ((COLS - 1) / 2 || 1);
  const cy = (row - (ROWS - 1) / 2) / ((ROWS - 1) / 2 || 1);
  const r = 130 + ((i * 53) % 70);
  return {
    tx: cx * r + ((i * 19) % 24) - 12,
    ty: cy * r - 18 + ((i * 31) % 22) - 11,
    tz: -70 - ((i * 41) % 90),
    rx: ((i * 53) % 36) - 18,
    ry: ((i * 37) % 36) - 18,
    rz: ((i * 29) % 28) - 14,
  };
});

// Stagger: each tile waits 0.18s after the previous one lands
const TILE_STAGGER = 0.18;
// Each tile animation duration
const TILE_DURATION = 0.62;

interface Props {
  triggered?: boolean;
  hovered?: boolean;
}

export default function CloudSyncFragmentImage({ triggered = false, hovered = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-40px" });
  const shouldAnimate = inView || triggered;

  const hasAssembled = useRef(false);
  const [assembled, setAssembled] = useState(false);
  const [isShattered, setIsShattered] = useState(false);
  const [glitching, setGlitching] = useState(false);

  // Mark assembled after last tile lands
  useEffect(() => {
    if (!shouldAnimate || hasAssembled.current) return;
    const lastSeq = TOTAL - 1;
    const lastTileDelay = lastSeq * TILE_STAGGER + TILE_DURATION + 0.3;
    const t = setTimeout(() => {
      setAssembled(true);
      hasAssembled.current = true;
    }, lastTileDelay * 1000);
    return () => clearTimeout(t);
  }, [shouldAnimate]);

  // Hover shatter / reassemble
  useEffect(() => {
    if (!hasAssembled.current) return;
    if (hovered) {
      setIsShattered(true);
      setAssembled(false);
    } else {
      setIsShattered(false);
      const t = setTimeout(() => setAssembled(true), 700);
      return () => clearTimeout(t);
    }
  }, [hovered]);

  // Periodic auto-glitch (subtle, only when assembled, not hovering)
  const startGlitch = useCallback(() => {
    if (!hasAssembled.current || isShattered || hovered) return;
    setGlitching(true);
    setAssembled(false);
    setTimeout(() => {
      setGlitching(false);
      setTimeout(() => setAssembled(true), 550);
    }, 110);
  }, [isShattered, hovered]);

  useEffect(() => {
    if (!assembled) return;
    const interval = setInterval(startGlitch, 8000);
    return () => clearInterval(interval);
  }, [assembled, startGlitch]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ perspective: "1000px", perspectiveOrigin: "50% 50%" }}
    >
      {/* Assembled glow pulse */}
      {assembled && (
        <motion.div
          key={`glow-${assembled}`}
          className="absolute inset-0 rounded-2xl pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          style={{ boxShadow: "inset 0 0 50px 10px rgba(185,255,75,0.3)" }}
        />
      )}

      {/* Hover shatter ring burst */}
      {isShattered && (
        <motion.div
          key="shatter-ring"
          className="absolute inset-0 rounded-2xl pointer-events-none z-20"
          initial={{ opacity: 0.9, scale: 0.94 }}
          animate={{ opacity: 0, scale: 1.07 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
          style={{ boxShadow: "0 0 0 2px rgba(185,255,75,0.8), 0 0 40px rgba(185,255,75,0.25)" }}
        />
      )}

      {/* Tile grid */}
      <div
        className="absolute inset-0"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          transformStyle: "preserve-3d",
        }}
      >
        {Array.from({ length: TOTAL }, (_, idx) => {
          const col = idx % COLS;
          const row = Math.floor(idx / COLS);
          const lp = LAUNCH_POSITIONS[idx];
          const hs = HOVER_SCATTER[idx];
          const seqPos = SEQ_POSITION[idx];
          const entryDelay = seqPos * TILE_STAGGER;
          const bpX = (col / (COLS - 1)) * 100;
          const bpY = (row / (ROWS - 1)) * 100;

          // Pick animate target
          const animTarget = !shouldAnimate
            ? {}
            : isShattered
            ? {
                opacity: 0.4,
                x: hs.tx,
                y: hs.ty,
                z: hs.tz,
                rotateX: hs.rx,
                rotateY: hs.ry,
                rotateZ: hs.rz,
                scale: 0.68,
                filter: "blur(2px)",
              }
            : glitching
            ? {
                opacity: 0.25,
                x: lp.tx * 0.15,
                y: lp.ty * 0.15,
                z: lp.tz * 0.15,
                rotateX: lp.rx * 0.2,
                rotateY: lp.ry * 0.2,
                rotateZ: lp.rz * 0.2,
                scale: 0.88,
                filter: "blur(1.5px)",
              }
            : {
                opacity: 1,
                x: 0,
                y: 0,
                z: 0,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                filter: "blur(0px)",
              };

          const transTarget = !shouldAnimate
            ? {}
            : isShattered
            ? {
                duration: 0.28,
                delay: idx * 0.01,
                ease: [0.6, 0, 0.4, 1],
              }
            : glitching
            ? { duration: 0.09 }
            : {
                // Sequential 1-by-1 landing with spring overshoot
                duration: TILE_DURATION,
                delay: hasAssembled.current ? idx * 0.018 : entryDelay,
                ease: [0.12, 1.4, 0.3, 1], // spring overshoot on landing
                opacity: {
                  duration: 0.3,
                  delay: hasAssembled.current ? idx * 0.014 : entryDelay,
                  ease: "easeOut",
                },
                filter: {
                  duration: 0.4,
                  delay: hasAssembled.current ? idx * 0.014 : entryDelay + 0.1,
                },
              };

          return (
            <motion.div
              key={idx}
              initial={{
                opacity: 0,
                x: lp.tx,
                y: lp.ty,
                z: lp.tz,
                rotateX: lp.rx,
                rotateY: lp.ry,
                rotateZ: lp.rz,
                scale: 0.55,
                filter: "blur(14px)",
              }}
              animate={animTarget}
              transition={transTarget}
              style={{
                backgroundImage: `url(${IMAGE_URL})`,
                backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                backgroundPosition: `${bpX}% ${bpY}%`,
                backgroundRepeat: "no-repeat",
                transformStyle: "preserve-3d",
              }}
            />
          );
        })}
      </div>

      {/* Grid seam lines flash on assembly completion */}
      {shouldAnimate && !assembled && !isShattered && !glitching && (
        <>
          {Array.from({ length: COLS - 1 }, (_, n) => (
            <motion.div
              key={`v${n}`}
              className="absolute top-0 bottom-0 pointer-events-none z-15"
              style={{
                left: `${((n + 1) / COLS) * 100}%`,
                width: "1px",
                background: "rgba(185,255,75,0.5)",
              }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 0.35,
                delay: (TOTAL - 1) * TILE_STAGGER + TILE_DURATION + 0.05,
              }}
            />
          ))}
          {Array.from({ length: ROWS - 1 }, (_, n) => (
            <motion.div
              key={`h${n}`}
              className="absolute left-0 right-0 pointer-events-none z-15"
              style={{
                top: `${((n + 1) / ROWS) * 100}%`,
                height: "1px",
                background: "rgba(185,255,75,0.5)",
              }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 0.35,
                delay: (TOTAL - 1) * TILE_STAGGER + TILE_DURATION + 0.05,
              }}
            />
          ))}
        </>
      )}

      {/* Final scan line sweep */}
      {shouldAnimate && !hasAssembled.current && (
        <motion.div
          className="absolute inset-x-0 pointer-events-none z-30"
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(185,255,75,0.9) 50%, transparent 100%)",
          }}
          initial={{ top: "100%", opacity: 0 }}
          animate={{ top: ["-2%", "102%"], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 0.6,
            delay: (TOTAL - 1) * TILE_STAGGER + TILE_DURATION + 0.15,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Reassemble scan after hover */}
      {!isShattered && assembled && !hovered && (
        <motion.div
          key="reassemble-scan"
          className="absolute inset-x-0 pointer-events-none z-30"
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(185,255,75,0.7) 50%, transparent 100%)",
          }}
          initial={{ top: "-2%", opacity: 0 }}
          animate={{ top: ["-2%", "102%"], opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: 0.55, delay: 0.4 }}
        />
      )}
    </div>
  );
}