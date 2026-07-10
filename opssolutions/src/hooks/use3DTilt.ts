import { useRef } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface Use3DTiltOptions {
  maxRotateX?: number;
  maxRotateY?: number;
  perspective?: number;
  stiffness?: number;
  damping?: number;
}

export function use3DTilt(options: Use3DTiltOptions = {}) {
  const {
    maxRotateX = 10,
    maxRotateY = 14,
    stiffness = 250,
    damping = 22,
  } = options;

  const cardRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-maxRotateY, maxRotateY]), {
    stiffness,
    damping,
  });
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [maxRotateX, -maxRotateX]), {
    stiffness,
    damping,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    rawY.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return {
    cardRef,
    rotateX,
    rotateY,
    handleMouseMove,
    handleMouseLeave,
  };
}