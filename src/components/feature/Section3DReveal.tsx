import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Section3DRevealProps {
  children: ReactNode;
  /** Extra delay in seconds before the entrance animation starts */
  delay?: number;
  className?: string;
}

/**
 * Section3DReveal
 *
 * Wraps a section with a scroll-triggered 3D entrance:
 *   - Starts tilted back on the X-axis (rotateX: 14°) and shifted down
 *   - Springs forward into flat, natural position as it enters the viewport
 *   - Combined with an opacity fade for maximum impact
 */
export default function Section3DReveal({
  children,
  delay = 0,
  className = "",
}: Section3DRevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 90,
        rotateX: 14,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        rotateX: 0,
      }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 1.1,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        transformPerspective: 1600,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}