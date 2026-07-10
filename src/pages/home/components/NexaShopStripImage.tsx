import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const IMAGE_URL = "/images/pro-bm.png";

const N = 7;
const DIAG = 9; // diagonal offset in %

// Precompute diagonal strip definitions
const STRIPS = Array.from({ length: N }, (_, i) => {
  const l = (i / N) * 100;
  const r = ((i + 1) / N) * 100;
  const d = DIAG;
  const clipPath = `polygon(${l - d}% 0%, ${r - d}% 0%, ${r + d}% 100%, ${l + d}% 100%)`;
  // Alternating top/bottom entry + slight Z depth
  const startY = i % 2 === 0 ? -140 : 140;
  const startZ = -50 - ((i * 37) % 90);
  const startRx = i % 2 === 0 ? -18 : 18;
  return { clipPath, startY, startZ, startRx, delay: i * 0.075 };
});

interface Props {
  triggered?: boolean;
}

export default function NexaShopStripImage({ triggered = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-40px" });
  const shouldAnimate = inView || triggered;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ perspective: "900px", perspectiveOrigin: "50% 50%" }}
    >
      {STRIPS.map((strip, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{
            y: strip.startY,
            z: strip.startZ,
            rotateX: strip.startRx,
            opacity: 0,
          }}
          animate={
            shouldAnimate
              ? { y: 0, z: 0, rotateX: 0, opacity: 1 }
              : {}
          }
          transition={{
            duration: 0.72,
            delay: strip.delay,
            ease: [0.16, 1, 0.3, 1],
            opacity: { duration: 0.45, delay: strip.delay },
          }}
          style={{
            backgroundImage: `url(${IMAGE_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            clipPath: strip.clipPath,
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* Diagonal seam flash on assembly completion */}
      {shouldAnimate &&
        Array.from({ length: N - 1 }, (_, i) => {
          const x = ((i + 1) / N) * 100;
          return (
            <motion.div
              key={`seam-${i}`}
              className="absolute top-0 bottom-0 pointer-events-none z-10"
              style={{
                left: `calc(${x}% - 1px)`,
                width: "1.5px",
                background: "rgba(41,171,226,0.6)",
                transform: `skewX(-${Math.atan(DIAG / 50) * (180 / Math.PI)}deg)`,
                transformOrigin: "center",
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 1, 0] }}
              transition={{
                duration: 0.45,
                delay: STRIPS[N - 1].delay + 0.38,
                ease: "easeOut",
              }}
            />
          );
        })}

      {/* Final lock glow sweep */}
      {shouldAnimate && (
        <motion.div
          className="absolute inset-x-0 pointer-events-none z-20"
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(41,171,226,0.85) 50%, transparent 100%)",
          }}
          initial={{ top: "100%", opacity: 0 }}
          animate={{ top: ["-2%", "102%"], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 0.7,
            delay: STRIPS[N - 1].delay + 0.5,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}