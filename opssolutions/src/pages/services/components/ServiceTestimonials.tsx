import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ServiceDetail } from "../data";

interface Props {
  service: ServiceDetail;
}

export default function ServiceTestimonials({ service }: Props) {
  const [active, setActive] = useState(0);
  const testimonial = service.testimonials[active];

  return (
    <section className="bg-dc-surface py-24 px-6 md:px-10 border-t border-dc-text/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-accent text-xs font-mono tracking-widest mb-3">CLIENT VOICES</p>
          <h2 className="text-3xl md:text-5xl font-bold text-dc-text">
            What <span className="text-accent">Clients Say</span>
          </h2>
          <p className="text-dc-text/50 text-sm mt-3 max-w-lg">
            Direct quotes from teams who&apos;ve shipped production products with us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selector sidebar */}
          <div className="flex flex-col gap-3">
            {service.testimonials.map((t, i) => (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                  active === i
                    ? "bg-accent/10 border-accent/40"
                    : "bg-dc-card border-dc-text/8 hover:border-dc-text/20"
                }`}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover object-top shrink-0"
                />
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${active === i ? "text-accent" : "text-dc-text"}`}>
                    {t.name}
                  </p>
                  <p className="text-dc-text/50 text-xs truncate">
                    {t.title}, {t.company}
                  </p>
                </div>
                {active === i && (
                  <div className="ml-auto shrink-0 w-2 h-2 rounded-full bg-accent"></div>
                )}
              </motion.button>
            ))}

            {/* Star rating strip */}
            <div className="mt-2 p-4 bg-dc-card border border-dc-text/5 rounded-2xl">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="ri-star-fill text-accent text-sm"></i>
                ))}
              </div>
              <p className="text-dc-text/50 text-xs leading-relaxed">
                Average 5.0 / 5.0 across all {service.title} engagements
              </p>
            </div>
          </div>

          {/* Quote display */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="bg-dc-card border border-dc-text/8 rounded-2xl p-8 md:p-10 flex flex-col h-full min-h-[320px]"
              >
                <div className="flex-1">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent/10 border border-accent/20 mb-7">
                    <i className="ri-double-quotes-l text-2xl text-accent"></i>
                  </div>
                  <p className="text-dc-text text-xl md:text-2xl font-medium leading-relaxed mb-8">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-dc-text/8">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover object-top shrink-0"
                  />
                  <div>
                    <p className="text-dc-text font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-dc-text/50 text-xs">
                      {testimonial.title} &middot; {testimonial.company}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="ri-star-fill text-accent text-xs"></i>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}