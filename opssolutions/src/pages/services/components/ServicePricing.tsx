import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { ServiceDetail } from "../data";

interface Props {
  service: ServiceDetail;
}

export default function ServicePricing({ service }: Props) {
  const navigate = useNavigate();

  return (
    <section className="bg-dc-surface py-24 px-6 md:px-10 border-t border-dc-text/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-accent text-xs font-mono tracking-widest mb-3">INVESTMENT</p>
          <h2 className="text-3xl md:text-5xl font-bold text-dc-text">
            Pricing <span className="text-accent">Guide</span>
          </h2>
          <p className="text-dc-text/35 text-sm mt-3 max-w-lg mx-auto">
            Every project is scoped individually. These ranges give you a realistic baseline before we talk.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {service.pricing.map((tier, i) => (
            <motion.div
              key={tier.tier}
              className={`rounded-2xl p-8 border transition-all duration-300 ${
                i === 1
                  ? "bg-accent border-accent/50 shadow-[0_0_40px_rgba(41,171,226,0.12)]"
                  : "bg-dc-card border-dc-text/5 hover:border-dc-text/15"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {i === 1 && (
                <span className="inline-block text-black text-xs font-bold bg-black/15 px-3 py-1 rounded-full mb-4">
                  MOST POPULAR
                </span>
              )}
              <h3 className={`text-xl font-bold mb-2 ${i === 1 ? "text-black" : "text-dc-text"}`}>
                {tier.tier}
              </h3>
              <p className={`text-3xl font-bold font-mono mb-4 ${i === 1 ? "text-black" : "text-accent"}`}>
                {tier.range}
              </p>
              <p className={`text-sm leading-relaxed ${i === 1 ? "text-black/60" : "text-dc-text/40"}`}>
                {tier.ideal}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-dc-card border border-dc-text/5 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="text-dc-text font-bold text-lg mb-1">
              Not sure which tier fits your project?
            </p>
            <p className="text-dc-text/40 text-sm">
              Book a free 30-minute call. We&apos;ll scope it out and give you a real estimate — no obligation.
            </p>
          </div>
          <button
            onClick={() => navigate("/#contact")}
            className="flex items-center gap-2 bg-accent text-black font-bold px-7 py-4 rounded-full hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap shrink-0"
          >
            Get a Free Estimate
            <i className="ri-arrow-right-line"></i>
          </button>
        </motion.div>
      </div>
    </section>
  );
}