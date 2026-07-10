import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";

interface ServiceTech {
  icon: string;
  title: string;
  tags: string[];
  color: string;
  number: string;
}

const SERVICE_TECHS: ServiceTech[] = [
  {
    icon: "ri-code-s-slash-line",
    title: "Web Dev",
    tags: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL"],
    color: "rgba(41,171,226,0.8)",
    number: "01",
  },
  {
    icon: "ri-smartphone-line",
    title: "Mobile",
    tags: ["React Native", "Flutter", "iOS", "Android", "Expo"],
    color: "rgba(41,171,226,0.8)",
    number: "02",
  },
  {
    icon: "ri-cloud-line",
    title: "Cloud",
    tags: ["AWS", "Docker", "Kubernetes", "Terraform", "Datadog"],
    color: "rgba(41,171,226,0.8)",
    number: "03",
  },
  {
    icon: "ri-palette-line",
    title: "UI/UX",
    tags: ["Figma", "Design Sys.", "Prototyping", "A/B Tests", "Research"],
    color: "rgba(41,171,226,0.8)",
    number: "04",
  },
  {
    icon: "ri-robot-line",
    title: "AI & ML",
    tags: ["OpenAI", "TensorFlow", "LangChain", "FastAPI", "PyTorch"],
    color: "rgba(41,171,226,0.8)",
    number: "05",
  },
  {
    icon: "ri-git-branch-line",
    title: "DevOps",
    tags: ["GitHub CI", "Terraform", "Ansible", "Prometheus", "Vault"],
    color: "rgba(41,171,226,0.8)",
    number: "06",
  },
];

export default function TechStackShelf() {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const cardObserverRef = useRef<IntersectionObserver | null>(null);
  const intersectRatios = useRef<number[]>(new Array(6).fill(0));

  // 3D tilt on the shelf
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 });

  useEffect(() => {
    // Observe the services section for shelf visibility
    const section = document.getElementById("services");
    if (!section) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting && entry.intersectionRatio > 0.05);
      },
      { threshold: [0, 0.05, 0.1] }
    );
    observerRef.current.observe(section);

    // Observe individual service cards
    const cards = section.querySelectorAll("[data-service-card]");
    if (cards.length > 0) {
      cardObserverRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const idx = parseInt((entry.target as HTMLElement).dataset.serviceCard ?? "0", 10);
            intersectRatios.current[idx] = entry.intersectionRatio;
          });

          // Find the card with the highest intersection ratio
          let maxRatio = 0;
          let maxIdx = 0;
          intersectRatios.current.forEach((ratio, i) => {
            if (ratio > maxRatio) {
              maxRatio = ratio;
              maxIdx = i;
            }
          });

          if (maxRatio > 0) {
            setPrevIndex(activeIndex);
            setActiveIndex(maxIdx);
          }
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1.0] }
      );
      cards.forEach((card) => cardObserverRef.current!.observe(card));
    }

    return () => {
      observerRef.current?.disconnect();
      cardObserverRef.current?.disconnect();
    };
  }, [activeIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set(((e.clientX - cx) / rect.width) * 12);
    mouseY.set(((e.clientY - cy) / rect.height) * -10);
    tiltX.set(((e.clientX - cx) / rect.width) * 12);
    tiltY.set(((e.clientY - cy) / rect.height) * -10);
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const active = SERVICE_TECHS[activeIndex];

  const direction = activeIndex > prevIndex ? 1 : -1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col"
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.9 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Current service tech stack"
        >
          <motion.div
            className="relative w-[130px] bg-dc-bg/85 backdrop-blur-xl border border-dc-text/12 rounded-2xl overflow-hidden"
            style={{
              rotateX: tiltY,
              rotateY: tiltX,
              transformPerspective: 800,
              transformStyle: "preserve-3d",
              boxShadow: "0 24px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(41,171,226,0.06)",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Glow top */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: "linear-gradient(90deg, transparent, rgba(41,171,226,0.7), transparent)" }}
            />

            {/* Header */}
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <motion.span
                  className="text-accent/40 text-[9px] font-mono tracking-widest uppercase"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Tech Stack
                </motion.span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeIndex}
                    className="text-accent/50 text-[9px] font-mono"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {active.number}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Icon + title */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: direction * 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: direction * -10 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-accent/10 border border-accent/20 shrink-0">
                    <i className={`${active.icon} text-accent text-sm`}></i>
                  </div>
                  <span className="text-dc-text text-xs font-semibold leading-tight">{active.title}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="h-px bg-dc-text/8 mx-3" />

            {/* Tags list */}
            <div className="px-3 py-3 flex flex-col gap-1.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  className="flex flex-col gap-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {active.tags.map((tag, i) => (
                    <motion.div
                      key={tag}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <motion.span
                        className="w-1 h-1 rounded-full bg-accent shrink-0"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      />
                      <span className="text-dc-text/65 text-[10px] font-mono truncate">{tag}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="px-3 pb-4 flex justify-center gap-1">
              {SERVICE_TECHS.map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-full bg-accent"
                  animate={{
                    width: i === activeIndex ? 16 : 4,
                    opacity: i === activeIndex ? 1 : 0.25,
                  }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: 4 }}
                />
              ))}
            </div>

            {/* Subtle bg glow */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(41,171,226,0.04) 0%, transparent 65%)" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}