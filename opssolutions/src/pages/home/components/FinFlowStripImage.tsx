import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const IMAGE_URL =
  "https://readdy.ai/api/search-image?query=financial%20analytics%20dashboard%20on%20widescreen%20monitor%2C%20dark%20interface%20with%20green%20neon%20data%20charts%20and%20graphs%2C%20cryptocurrency%20and%20finance%20metrics%2C%20cinematic%20studio%20setup%2C%20high-tech%20trading%20platform%20aesthetic%2C%20dramatic%20lighting&width=800&height=600&seq=portfolio_03&orientation=landscape";

const N = 5; // number of horizontal strips

// Each strip: covers a horizontal band of the image
// backgroundPosition scrolls to show the correct vertical slice
const STRIPS = Array.from({ length: N }, (_, i) => {
  const topPct = (i / N) * 100;
  const heightPct = 100 / N;
  // background-position Y to show correct part of image in this strip
  const bpY = N === 1 ? 0 : (i / (N - 1)) * 100;
  // Alternating left/right entry + Z depth
  const startX = i % 2 === 0 ? -160 : 160;
  const startZ = -40 - ((i * 43) % 80);
  const startRy = i % 2 === 0 ? -12 : 12;
  return { topPct, heightPct, bpY, startX, startZ, startRy, delay: i * 0.09 };
});

interface Props {
  triggered?: boolean;
}

export default function FinFlowStripImage({ triggered = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-40px" });
  const shouldAnimate = inView || triggered;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ perspective: "900px", perspectiveOrigin: "50% 50%" }}
    >
      {STRIPS.map((strip, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0"
          initial={{
            x: strip.startX,
            z: strip.startZ,
            rotateY: strip.startRy,
            opacity: 0,
          }}
          animate={
            shouldAnimate
              ? { x: 0, z: 0, rotateY: 0, opacity: 1 }
              : {}
          }
          transition={{
            duration: 0.68,
            delay: strip.delay,
            ease: [0.16, 1, 0.3, 1],
            opacity: { duration: 0.4, delay: strip.delay },
          }}
          style={{
            top: `${strip.topPct}%`,
            height: `${strip.heightPct}%`,
            backgroundImage: `url(${IMAGE_URL})`,
            backgroundSize: `100% ${N * 100}%`,
            backgroundPosition: `0% ${strip.bpY}%`,
            backgroundRepeat: "no-repeat",
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* Horizontal seam flash lines */}
      {shouldAnimate &&
        Array.from({ length: N - 1 }, (_, i) => {
          const y = ((i + 1) / N) * 100;
          return (
            <motion.div
              key={`hseam-${i}`}
              className="absolute left-0 right-0 pointer-events-none z-10"
              style={{
                top: `calc(${y}% - 0.5px)`,
                height: "1.5px",
                background: "rgba(41,171,226,0.55)",
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 1, 0] }}
              transition={{
                duration: 0.4,
                delay: STRIPS[N - 1].delay + 0.35,
                ease: "easeOut",
              }}
            />
          );
        })}

      {/* Lock-in vertical scan */}
      {shouldAnimate && (
        <motion.div
          className="absolute top-0 bottom-0 pointer-events-none z-20"
          style={{
            width: "2px",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(41,171,226,0.9) 50%, transparent 100%)",
          }}
          initial={{ left: "-2px", opacity: 0 }}
          animate={{ left: ["0%", "102%"], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 0.65,
            delay: STRIPS[N - 1].delay + 0.45,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}