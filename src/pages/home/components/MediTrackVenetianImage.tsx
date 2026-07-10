import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const IMAGE_URL = "/images/pro-pnp.jpg";

// Reduced from 9 → 6 columns for better GPU performance
const N = 6;

const COLUMNS = Array.from({ length: N }, (_, i) => {
  const bpX = N === 1 ? 50 : (i / (N - 1)) * 100;
  const startRy = i % 2 === 0 ? -90 : 90;
  const startZ = -30 - ((i * 47) % 60);
  return { bpX, startRy, startZ, delay: i * 0.09 + 0.05 };
});

interface Props {
  triggered?: boolean;
  hovered?: boolean;
}

export default function MediTrackVenetianImage({ triggered = false, hovered = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-40px" });
  const shouldAnimate = inView || triggered;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ perspective: "1100px", perspectiveOrigin: "50% 50%" }}
    >
      {/* Venetian blind columns */}
      {COLUMNS.map((col, i) => (
        <motion.div
          key={i}
          className="absolute top-0 bottom-0"
          style={{
            left: `${(i / N) * 100}%`,
            width: `${100 / N + 0.4}%`,
            backgroundImage: `url(${IMAGE_URL})`,
            backgroundSize: `${N * 100}% 100%`,
            backgroundPosition: `${col.bpX}% center`,
            backgroundRepeat: "no-repeat",
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}
          initial={{ rotateY: col.startRy, z: col.startZ, opacity: 0 }}
          animate={shouldAnimate ? { rotateY: 0, z: 0, opacity: 1 } : {}}
          transition={{
            duration: 0.65,
            delay: col.delay,
            ease: [0.16, 1, 0.3, 1],
            opacity: { duration: 0.35, delay: col.delay + 0.05 },
          }}
        />
      ))}

      {/* Hover neon edge glow (CSS only, no GPU-heavy filter) */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
        animate={{
          boxShadow: hovered
            ? "inset 0 0 0 1.5px rgba(41,171,226,0.35), inset 0 0 40px rgba(41,171,226,0.08)"
            : "inset 0 0 0 0px rgba(41,171,226,0)",
        }}
        transition={{ duration: 0.35 }}
      />

      {/* Hover scanline overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(41,171,226,0.025) 0px, rgba(41,171,226,0.025) 1px, transparent 1px, transparent 3px)",
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Assembly seam flash */}
      {shouldAnimate && (
        <>
          {Array.from({ length: N - 1 }, (_, i) => (
            <motion.div
              key={`vseam-${i}`}
              className="absolute top-0 bottom-0 pointer-events-none z-10"
              style={{
                left: `calc(${((i + 1) / N) * 100}% - 1px)`,
                width: "1.5px",
                background: "rgba(41,171,226,0.55)",
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 1, 0] }}
              transition={{
                duration: 0.38,
                delay: COLUMNS[N - 1].delay + 0.3,
                ease: "easeOut",
              }}
            />
          ))}
          <motion.div
            className="absolute inset-x-0 pointer-events-none z-20"
            style={{
              height: "2px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(41,171,226,0.95) 50%, transparent 100%)",
            }}
            initial={{ top: "-2%", opacity: 0 }}
            animate={{ top: ["-2%", "102%"], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 0.65,
              delay: COLUMNS[N - 1].delay + 0.4,
              ease: "easeInOut",
            }}
          />
        </>
      )}
    </div>
  );
}