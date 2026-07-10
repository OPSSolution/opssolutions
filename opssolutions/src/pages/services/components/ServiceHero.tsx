import { motion } from "framer-motion";
import type { ServiceDetail } from "../data";

interface Props {
  service: ServiceDetail;
}

export default function ServiceHero({ service }: Props) {
  return (
    <section className="relative pt-0 overflow-hidden">
      {/* Hero image */}
      <div className="relative w-full h-[520px] md:h-[620px]">
        <img
          src={service.heroImage}
          alt={service.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dc-bg via-dc-bg/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dc-bg/80 via-transparent to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full pb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent/20 border border-accent/30">
                <i className={`${service.icon} text-accent text-lg`}></i>
              </div>
              <p className="text-accent text-xs font-mono tracking-widest">SERVICE</p>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.0] mb-4">
              {service.title}
            </h1>
            <p className="text-white/50 text-xl mb-6">{service.subtitle}</p>
            <p className="text-white/40 text-base leading-relaxed max-w-2xl mb-8">
              {service.description}
            </p>

            {/* Tagline */}
            <div className="inline-flex items-center gap-3 bg-accent/10 border border-accent/25 rounded-full px-5 py-2.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse inline-block"></span>
              <span className="text-accent text-sm font-medium">{service.tagline}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 -mt-6 relative z-10 pb-16">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {service.stats.map((stat, i) => (
            <div
              key={i}
              className="bg-dc-card border border-dc-text/8 rounded-2xl p-5 text-center"
            >
              <p className="text-2xl font-bold text-accent font-mono">{stat.value}</p>
              <p className="text-dc-text/40 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}