import { motion } from "framer-motion";
import type { ServiceDetail } from "../data";

interface Props {
  service: ServiceDetail;
}

export default function ServiceApproach({ service }: Props) {
  return (
    <section className="bg-dc-surface py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-accent text-xs font-mono tracking-widest mb-3">OUR APPROACH</p>
          <h2 className="text-3xl md:text-5xl font-bold text-dc-text">
            How we approach <span className="text-accent">{service.title.toLowerCase()}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {service.approach.map((item, i) => (
            <motion.div
              key={i}
              className="bg-dc-card border border-dc-text/5 rounded-2xl p-8 hover:border-accent/20 transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-start gap-4">
                <span className="text-accent/30 text-4xl font-bold font-mono leading-none mt-1 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-dc-text font-bold text-lg mb-3">{item.title}</h3>
                  <p className="text-dc-text/45 text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}