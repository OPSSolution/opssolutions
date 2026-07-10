import { motion } from "framer-motion";
import type { ServiceDetail } from "../data";

interface Props {
  service: ServiceDetail;
}

export default function ServiceIndustries({ service }: Props) {
  return (
    <section className="bg-dc-surface py-24 px-6 md:px-10 border-t border-dc-text/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-accent text-xs font-mono tracking-widest mb-3">INDUSTRIES WE SERVE</p>
          <h2 className="text-3xl md:text-5xl font-bold text-dc-text">
            Built for <span className="text-accent">your industry</span>
          </h2>
          <p className="text-dc-text/35 text-sm mt-3 max-w-xl">
            Sector-specific knowledge means we understand your compliance requirements, user expectations, and competitive landscape from day one.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {service.industries.map((industry, i) => (
            <motion.div
              key={industry.name}
              className="group bg-dc-card border border-dc-text/5 rounded-2xl p-6 hover:border-accent/25 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-dc-text/5 group-hover:bg-accent/10 transition-colors duration-300">
                  <i className={`${industry.icon} text-dc-text/50 group-hover:text-accent text-lg transition-colors duration-300`}></i>
                </div>
                <h4 className="text-dc-text font-bold text-base group-hover:text-accent transition-colors duration-300">
                  {industry.name}
                </h4>
              </div>
              <p className="text-dc-text/40 text-sm leading-relaxed">{industry.example}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}