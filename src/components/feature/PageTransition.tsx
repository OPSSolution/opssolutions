import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const variants = {
  initial: { opacity: 0, y: 18 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.3,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      style={{ minHeight: "100vh" }}
    >
      {children}
    </motion.div>
  );
}