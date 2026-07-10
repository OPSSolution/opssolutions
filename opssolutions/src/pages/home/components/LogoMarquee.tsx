import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const clients = [
  { name: "Stripe", icon: "ri-bank-card-line" },
  { name: "Shopify", icon: "ri-store-3-line" },
  { name: "HubSpot", icon: "ri-customer-service-2-line" },
  { name: "Notion", icon: "ri-file-text-line" },
  { name: "Vercel", icon: "ri-cloud-fill" },
  { name: "Linear", icon: "ri-bar-chart-grouped-line" },
  { name: "Figma", icon: "ri-pen-nib-line" },
  { name: "Twilio", icon: "ri-message-2-line" },
  { name: "Datadog", icon: "ri-radar-line" },
  { name: "Intercom", icon: "ri-chat-smile-3-line" },
  { name: "Segment", icon: "ri-pie-chart-2-line" },
  { name: "Algolia", icon: "ri-search-line" },
];

// Duplicate for seamless loop
const allClients = [...clients, ...clients];

export default function LogoMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      className="relative bg-dc-surface border-y border-dc-text/6 py-12 overflow-hidden"
    >
      {/* Section label */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p className="text-dc-text/60 text-xs font-mono tracking-[0.25em] uppercase">
          Trusted by teams at world-class companies
        </p>
      </motion.div>

      {/* Gradient fades on sides */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-dc-surface to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-dc-surface to-transparent" />

      {/* Marquee track */}
      <div className="flex overflow-hidden">
        <motion.div
          className="flex gap-12 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 32,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{ willChange: "transform" }}
        >
          {allClients.map((client, i) => (
            <motion.div
              key={`${client.name}-${i}`}
              className="flex items-center gap-3 px-6 py-3 rounded-xl border border-dc-text/6 bg-dc-card/50 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 cursor-default group shrink-0"
              whileHover={{ scale: 1.06, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <i className={`${client.icon} text-xl text-dc-text/65 group-hover:text-accent transition-colors duration-300`} />
              </div>
              <span className="text-dc-text/75 text-sm font-medium font-grotesk group-hover:text-dc-text/95 transition-colors duration-300 tracking-tight">
                {client.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Subtle accent glow in the middle */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-20 rounded-full bg-accent/3 blur-3xl" />
      </div>
    </section>
  );
}