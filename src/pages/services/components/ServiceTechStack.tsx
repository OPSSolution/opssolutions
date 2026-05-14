import { motion } from "framer-motion";
import type { ServiceDetail } from "../data";

interface Props {
  service: ServiceDetail;
}

export default function ServiceTechStack({ service }: Props) {
  return (
    <section className="bg-dc-bg py-24 px-6 md:px-10 border-t border-dc-text/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-accent text-xs font-mono tracking-widest mb-3">TOOLS & TECHNOLOGIES</p>
          <h2 className="text-3xl md:text-5xl font-bold text-dc-text">
            Our <span className="text-accent">Tech Stack</span>
          </h2>
          <p className="text-dc-text/35 text-sm mt-3 max-w-xl">
            We use battle-tested, production-proven tools — not whatever's trending on Hacker News this week.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {service.techStack.map((cat, i) => (
            <motion.div
              key={cat.category}
              className="bg-dc-card border border-dc-text/5 rounded-2xl p-6 hover:border-accent/20 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <h4 className="text-dc-text/50 text-xs font-mono tracking-widest mb-4 uppercase">
                {cat.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="text-sm font-medium text-dc-text bg-dc-text/5 border border-dc-text/8 px-3 py-1.5 rounded-lg hover:border-accent/30 hover:text-accent transition-colors duration-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}