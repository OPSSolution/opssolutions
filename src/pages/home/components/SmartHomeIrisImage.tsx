import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const IMAGE_URL =
  "https://readdy.ai/api/search-image?query=smart%20home%20IoT%20app%20interface%20on%20tablet%20and%20phone%20mockups%2C%20modern%20living%20room%20with%20ambient%20lighting%20controls%2C%20dark%20themed%20mobile%20interface%20with%20device%20management%2C%20home%20automation%20dashboard%2C%20tech%20product%20photography%20with%20soft%20ambient%20glow&width=800&height=600&seq=portfolio_06&orientation=landscape";

const N_SECTORS = 10;

/** Build a polygon clip-path for a pie sector */
function buildSectorPath(sectorIndex: number, total: number): string {
  const startDeg = (sectorIndex / total) * 360 - 90;
  const endDeg = ((sectorIndex + 1) / total) * 360 - 90;
  const cx = 50;
  const cy = 50;
  const r = 92; // % — big enough to cover card corners
  const steps = 14;
  const pts: string[] = [`${cx}% ${cy}%`];
  for (let s = 0; s <= steps; s++) {
    const angle = (startDeg + (endDeg - startDeg) * (s / steps)) * (Math.PI / 180);
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    pts.push(`${px.toFixed(3)}% ${py.toFixed(3)}%`);
  }
  return `polygon(${pts.join(", ")})`;
}

const SECTORS = Array.from({ length: N_SECTORS }, (_, i) => ({
  clipPath: buildSectorPath(i, N_SECTORS),
  delay: i * 0.058 + 0.04,
  // slight 3D rotation of each sector on entry — tumble in from depth
  startRz: (i / N_SECTORS) * 360 - 180,
  startScale: 0.0,
}));

interface Props {
  triggered?: boolean;
  hovered?: boolean;
}

export default function SmartHomeIrisImage({ triggered = false, hovered = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-40px" });
  const shouldAnimate = inView || triggered;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ perspective: "1000px", perspectiveOrigin: "50% 50%" }}
    >
      {/* Each sector is a slice of the full image */}
      {SECTORS.map((sector, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${IMAGE_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            clipPath: sector.clipPath,
            transformStyle: "preserve-3d",
            transformOrigin: "50% 50%",
            willChange: "transform, opacity",
          }}
          initial={{
            scale: sector.startScale,
            rotateZ: sector.startRz,
            opacity: 0,
            filter: "blur(8px)",
          }}
          animate={
            shouldAnimate
              ? {
                  scale: hovered ? 1.04 : 1,
                  rotateZ: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                }
              : {}
          }
          transition={{
            duration: 0.72,
            delay: shouldAnimate ? sector.delay : 0,
            ease: [0.2, 1.2, 0.4, 1],
            opacity: { duration: 0.4, delay: sector.delay },
            filter: { duration: 0.5, delay: sector.delay },
            scale: hovered
              ? { duration: 0.55, ease: "easeOut", delay: i * 0.025 }
              : { duration: 0.65, ease: [0.2, 1.2, 0.4, 1], delay: sector.delay },
          }}
        />
      ))}

      {/* Iris ring glow lines — appear at assembly */}
      {shouldAnimate && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.05, 1.0] }}
          transition={{
            duration: 0.7,
            delay: SECTORS[N_SECTORS - 1].delay + 0.25,
            ease: "easeOut",
          }}
        >
          <div
            className="w-4/5 h-4/5 rounded-full pointer-events-none"
            style={{
              border: "1.5px solid rgba(185,255,75,0.65)",
              boxShadow: "0 0 22px rgba(185,255,75,0.28), inset 0 0 22px rgba(185,255,75,0.1)",
            }}
          />
        </motion.div>
      )}

      {/* Hover: breathing ring + sector glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="w-3/4 h-3/4 rounded-full pointer-events-none"
          style={{
            border: "1px solid rgba(185,255,75,0.4)",
            boxShadow: "0 0 30px rgba(185,255,75,0.18), inset 0 0 30px rgba(185,255,75,0.06)",
          }}
          animate={hovered ? { scale: [1, 1.04, 0.97, 1.02, 1] } : { scale: 1 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Sector divider lines — briefly flash on assembly */}
      {shouldAnimate &&
        Array.from({ length: N_SECTORS }, (_, i) => {
          const angle = (i / N_SECTORS) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const x2 = 50 + 92 * Math.cos(rad);
          const y2 = 50 + 92 * Math.sin(rad);
          return (
            <motion.svg
              key={`seam-${i}`}
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.65, 0] }}
              transition={{
                duration: 0.4,
                delay: SECTORS[N_SECTORS - 1].delay + 0.2,
                ease: "easeOut",
              }}
            >
              <line
                x1="50"
                y1="50"
                x2={x2.toFixed(2)}
                y2={y2.toFixed(2)}
                stroke="rgba(185,255,75,0.7)"
                strokeWidth="0.35"
              />
            </motion.svg>
          );
        })}

      {/* Entry lock sweep */}
      {shouldAnimate && (
        <motion.div
          className="absolute inset-x-0 pointer-events-none z-20"
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(185,255,75,0.9) 50%, transparent 100%)",
          }}
          initial={{ top: "100%", opacity: 0 }}
          animate={{ top: ["-2%", "102%"], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 0.65,
            delay: SECTORS[N_SECTORS - 1].delay + 0.38,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}