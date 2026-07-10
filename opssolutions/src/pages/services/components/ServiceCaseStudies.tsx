import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { ServiceDetail } from "../data";

interface Props {
  service: ServiceDetail;
}

export default function ServiceCaseStudies({ service }: Props) {
  const navigate = useNavigate();

  return (
    <section className="bg-dc-bg py-24 px-6 md:px-10 border-t border-dc-text/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-accent text-xs font-mono tracking-widest mb-3">PROOF OF WORK</p>
          <h2 className="text-3xl md:text-5xl font-bold text-dc-text">
            Real <span className="text-accent">Case Studies</span>
          </h2>
          <p className="text-dc-text/35 text-sm mt-3">
            Not mockups. These are production systems we&apos;ve built and delivered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {service.caseStudies.map((cs, i) => (
            <motion.article
              key={cs.slug}
              className="group bg-dc-card border border-dc-text/5 rounded-2xl overflow-hidden hover:border-accent/25 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/case-study/${cs.slug}`)}
              whileHover={{ y: -4 }}
            >
              <div className="relative w-full h-52 overflow-hidden">
                <img
                  src={cs.image}
                  alt={cs.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dc-card via-transparent to-transparent" />
              </div>
              <div className="p-7">
                <h3 className="text-dc-text font-bold text-xl mb-2 group-hover:text-accent transition-colors duration-300">
                  {cs.title}
                </h3>
                {/* Result callout */}
                <div className="flex items-start gap-2 mb-4 bg-accent/8 border border-accent/15 rounded-xl p-3">
                  <i className="ri-check-double-line text-accent text-sm mt-0.5 shrink-0"></i>
                  <p className="text-accent/80 text-sm font-medium">{cs.result}</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {cs.tags.map((tag) => (
                    <span key={tag} className="text-xs font-mono text-dc-text/30 bg-dc-text/5 px-2.5 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-accent/60 text-sm font-medium group-hover:text-accent transition-colors duration-300">
                  <span>Read Full Case Study</span>
                  <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform duration-300"></i>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}