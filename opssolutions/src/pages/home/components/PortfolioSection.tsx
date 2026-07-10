import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { use3DTilt } from "@/hooks/use3DTilt";
import PortfolioLightbox, { LightboxProject } from "@/pages/home/components/PortfolioLightbox";
import LivePreviewModal from "@/pages/home/components/LivePreviewModal";
import CloudSyncFragmentImage from "@/pages/home/components/CloudSyncFragmentImage";
import NexaShopStripImage from "@/pages/home/components/NexaShopStripImage";
import FinFlowStripImage from "@/pages/home/components/FinFlowStripImage";
import MediTrackVenetianImage from "@/pages/home/components/MediTrackVenetianImage";
import AuraAIPixelImage from "@/pages/home/components/AuraAIPixelImage";
import SmartHomeIrisImage from "@/pages/home/components/SmartHomeIrisImage";

const categories = ["All", "Web", "Mobile", "Cloud", "AI"];

const projects = [
  {
    id: 1,
    title: "NexaShop Platform",
    category: "Web",
    description: "A high-performance e-commerce platform processing $2M+ daily transactions with real-time inventory and AI-powered recommendations.",
    tags: ["React", "Node.js", "Redis", "AWS"],
    year: "2025",
    slug: "nexashop-platform",
    number: "01",
    image: "https://readdy.ai/api/search-image?query=sleek%20dark%20e-commerce%20web%20platform%20dashboard%20on%20multiple%20screens%2C%20modern%20UI%20with%20product%20grids%20and%20analytics%20charts%2C%20dark%20theme%20interface%20with%20green%20accents%2C%20professional%20tech%20photography%20studio%20lighting%2C%20minimalist%20digital%20product%20design&width=800&height=600&seq=portfolio_01&orientation=landscape",
    result: "$2M+ daily transactions",
  },
  {
    id: 2,
    title: "MediTrack Mobile",
    category: "Mobile",
    description: "Healthcare app used by 300+ clinics to manage patient records, appointments, and remote consultations with HIPAA-compliant security.",
    tags: ["React Native", "Firebase", "TypeScript"],
    year: "2025",
    slug: "meditrack-mobile",
    number: "02",
    image: "https://readdy.ai/api/search-image?query=mobile%20healthcare%20app%20mockup%20on%20smartphone%2C%20clean%20white%20and%20dark%20interface%20with%20medical%20data%20charts%2C%20appointment%20scheduling%20UI%2C%20professional%20product%20photography%20on%20dark%20background%2C%20minimal%20health%20tech%20design&width=800&height=600&seq=portfolio_02&orientation=landscape",
    result: "300+ clinics · 4.9★",
  },
  {
    id: 3,
    title: "FinFlow Dashboard",
    category: "Web",
    description: "Real-time financial analytics dashboard for a Series B fintech startup, handling complex data visualization and multi-currency transactions.",
    tags: ["Vue.js", "D3.js", "Python", "PostgreSQL"],
    year: "2024",
    slug: "finflow-dashboard",
    number: "03",
    image: "https://readdy.ai/api/search-image?query=financial%20analytics%20dashboard%20on%20widescreen%20monitor%2C%20dark%20interface%20with%20green%20neon%20data%20charts%20and%20graphs%2C%20cryptocurrency%20and%20finance%20metrics%2C%20cinematic%20studio%20setup%2C%20high-tech%20trading%20platform%20aesthetic%2C%20dramatic%20lighting&width=800&height=600&seq=portfolio_03&orientation=landscape",
    result: "50k users at launch",
  },
  {
    id: 4,
    title: "CloudSync Infrastructure",
    category: "Cloud",
    description: "Multi-cloud infrastructure for a logistics company, reducing deployment time by 80% and achieving 99.99% uptime with auto-scaling.",
    tags: ["AWS", "Terraform", "Docker", "Datadog"],
    year: "2024",
    slug: "cloudsync-infrastructure",
    number: "04",
    image: "https://readdy.ai/api/search-image?query=cloud%20infrastructure%20architecture%20diagram%20on%20dark%20background%2C%20server%20rooms%20with%20glowing%20cables%20and%20LED%20lights%2C%20data%20center%20technology%20visualization%2C%20network%20topology%20with%20green%20connection%20nodes%2C%20futuristic%20server%20management%20interface&width=800&height=600&seq=portfolio_04&orientation=landscape",
    result: "80% faster deploys",
  },
  {
    id: 5,
    title: "AuraAI Content Engine",
    category: "AI",
    description: "AI-powered content generation platform with fine-tuned LLMs, producing 10,000+ pieces of branded content monthly across 14 languages.",
    tags: ["Python", "LangChain", "OpenAI", "FastAPI"],
    year: "2025",
    slug: "auraai-content-engine",
    number: "05",
    image: "https://readdy.ai/api/search-image?query=artificial%20intelligence%20content%20generation%20interface%2C%20neural%20network%20visualization%20with%20glowing%20nodes%20on%20dark%20background%2C%20AI%20text%20generation%20UI%20with%20code%20and%20language%20models%2C%20futuristic%20machine%20learning%20platform%2C%20lime%20green%20accent%20colors%2C%20cinematic%20digital%20art&width=800&height=600&seq=portfolio_05&orientation=landscape",
    result: "10k+ pieces/month",
  },
  {
    id: 6,
    title: "SmartHome Connect",
    category: "Mobile",
    description: "IoT home automation app controlling 200+ device types, featuring voice commands, energy analytics, and geofencing automation routines.",
    tags: ["Flutter", "MQTT", "Golang", "InfluxDB"],
    year: "2025",
    slug: "smarthome-connect",
    number: "06",
    image: "https://readdy.ai/api/search-image?query=smart%20home%20IoT%20app%20interface%20on%20tablet%20and%20phone%20mockups%2C%20modern%20living%20room%20with%20ambient%20lighting%20controls%2C%20dark%20themed%20mobile%20interface%20with%20device%20management%2C%20home%20automation%20dashboard%2C%20tech%20product%20photography%20with%20soft%20ambient%20glow&width=800&height=600&seq=portfolio_06&orientation=landscape",
    result: "200+ device types",
  },
];

function ProjectCard({ project, index, onPreview, onLivePreview }: { project: typeof projects[0]; index: number; onPreview: (p: LightboxProject) => void; onLivePreview: (p: typeof projects[0]) => void }) {
  const [hovered, setHovered] = useState(false);
  const inViewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(inViewRef, { once: true, margin: "-60px" });
  const { cardRef, rotateX, rotateY, handleMouseMove, handleMouseLeave: tiltLeave } = use3DTilt({ maxRotateX: 6, maxRotateY: 9 });

  return (
    <motion.article
      ref={(el) => {
        (inViewRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      layout
      initial={{
        opacity: 0,
        y: 90,
        z: -220,
        scale: 0.82,
        rotateX: 22,
        rotateY: index % 2 === 0 ? -14 : 14,
        filter: "blur(12px)",
      }}
      animate={
        inView
          ? { opacity: 1, y: 0, z: 0, scale: 1, rotateX: 0, rotateY: 0, filter: "blur(0px)" }
          : {}
      }
      exit={{ opacity: 0, scale: 0.9, z: -100, filter: "blur(8px)", transition: { duration: 0.3 } }}
      transition={{
        duration: 0.85,
        delay: index * 0.16,
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 0.55, delay: index * 0.16 },
        filter: { duration: 0.55, delay: index * 0.16 },
      }}
      onClick={() => onPreview(project as LightboxProject)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); tiltLeave(); }}
      className="relative group cursor-pointer overflow-hidden rounded-2xl"
      style={{ height: "390px", rotateX, rotateY, transformPerspective: 1200, transformStyle: "preserve-3d" } as React.CSSProperties}
    >
      {/* Background image — each featured card gets its own 3D assembly effect */}
      {project.id === 4 ? (
        <CloudSyncFragmentImage triggered={inView} hovered={hovered} />
      ) : project.id === 1 ? (
        <NexaShopStripImage triggered={inView} />
      ) : project.id === 3 ? (
        <FinFlowStripImage triggered={inView} />
      ) : project.id === 2 ? (
        <MediTrackVenetianImage triggered={inView} hovered={hovered} />
      ) : project.id === 5 ? (
        <AuraAIPixelImage triggered={inView} hovered={hovered} />
      ) : project.id === 6 ? (
        <SmartHomeIrisImage triggered={inView} hovered={hovered} />
      ) : (
        <motion.div
          className="absolute inset-0 w-full h-full"
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={project.image} alt={project.title} className="w-full h-full object-cover object-top" />
        </motion.div>
      )}

      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

      {/* Deep hover overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/96 via-black/65 to-black/15"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Top meta */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
        <motion.span
          className="bg-accent text-black text-xs font-bold px-3 py-1 rounded-full"
          animate={{ opacity: hovered ? 0 : 1, y: hovered ? -8 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {project.category}
        </motion.span>
        <motion.span
          className="text-white/40 text-xs font-mono"
          animate={{ opacity: hovered ? 0 : 0.4 }}
        >
          {project.year}
        </motion.span>
      </div>

      {/* Decorative number */}
      <motion.span
        className="absolute top-1/2 -translate-y-1/2 right-6 text-9xl font-bold font-mono text-white/[0.035] select-none z-10 leading-none"
        animate={{ opacity: hovered ? 0 : 1, x: hovered ? 24 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {project.number}
      </motion.span>

      {/* Default footer */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-6 z-10"
        animate={{ y: hovered ? 12 : 0, opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-white font-bold text-xl">{project.title}</h3>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs font-mono text-white/40 bg-white/10 px-2 py-0.5 rounded-md">{tag}</span>
          ))}
        </div>
      </motion.div>

      {/* Hover reveal panel */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-7 z-20"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 35, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block text-accent text-xs font-mono tracking-widest mb-3">
              {project.category.toUpperCase()} / {project.year}
            </span>
            <h3 className="text-white font-bold text-2xl mb-3 leading-tight">{project.title}</h3>
            <p className="text-white/55 text-sm leading-relaxed mb-4">{project.description}</p>

            {/* Result badge */}
            <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/25 text-accent text-xs font-mono px-3 py-1.5 rounded-full mb-4">
              <i className="ri-check-double-line text-sm"></i>
              {project.result}
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs font-mono text-accent/70 bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-md">{tag}</span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-accent text-sm font-bold">
                Preview Project
                <motion.i
                  className="ri-eye-line"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
              </span>
              <span className="text-white/15 text-4xl font-bold font-mono">{project.number}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Live Preview Button ── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto"
            initial={{ opacity: 0, scale: 0.75, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.button
              onClick={(e) => { e.stopPropagation(); onLivePreview(project); }}
              className="relative flex items-center gap-2.5 bg-[#080d1a]/80 border border-accent/50 backdrop-blur-md text-accent text-sm font-bold px-5 py-3 rounded-full cursor-pointer whitespace-nowrap overflow-hidden"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              style={{ boxShadow: "0 0 20px rgba(41,171,226,0.3), 0 0 60px rgba(41,171,226,0.1), inset 0 0 0 1px rgba(41,171,226,0.25)" }}
            >
              {/* Animated glow sweep */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: "linear-gradient(90deg, transparent 0%, rgba(41,171,226,0.15) 50%, transparent 100%)" }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                className="w-2 h-2 rounded-full bg-accent relative z-10"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="relative z-10">Live Preview</span>
              <i className="ri-external-link-line relative z-10 text-sm"></i>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: hovered
            ? "inset 0 0 0 1.5px rgba(41,171,226,0.4), 0 24px 48px rgba(0,0,0,0.4)"
            : "inset 0 0 0 1.5px rgba(41,171,226,0)",
        }}
        transition={{ duration: 0.35 }}
      />
    </motion.article>
  );
}

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxProject, setLightboxProject] = useState<LightboxProject | null>(null);
  const [livePreviewProject, setLivePreviewProject] = useState<typeof projects[0] | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const filtered = activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="bg-dc-bg py-28 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div>
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0 }}
              animate={headerInView ? { opacity: 1 } : {}}
            >
              <motion.p
                className="text-accent text-sm font-mono tracking-widest mb-4"
                initial={{ y: 20 }}
                animate={headerInView ? { y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                OUR WORK
              </motion.p>
            </motion.div>
            <div className="overflow-hidden">
              <motion.h2
                className="text-4xl md:text-6xl font-bold text-dc-text leading-tight"
                initial={{ y: "110%" }}
                animate={headerInView ? { y: 0 } : {}}
                transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                Selected <span className="text-accent">Projects</span>
              </motion.h2>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                initial={{ opacity: 0, y: 16 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.07 }}
                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? "bg-accent text-black"
                    : "bg-dc-text/5 text-dc-text/50 hover:text-dc-text border border-dc-text/10 hover:border-dc-text/20"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5" style={{ perspective: "1400px", perspectiveOrigin: "50% 40%" }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} onPreview={setLightboxProject} onLivePreview={setLivePreviewProject} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-dc-text/30 text-sm mb-4">Want to see more of our work?</p>
          <motion.button
            onClick={() => { const el = document.getElementById("contact"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 border border-dc-text/15 text-dc-text text-sm font-medium px-6 py-3 rounded-full hover:border-accent hover:text-accent transition-colors duration-300 cursor-pointer whitespace-nowrap"
          >
            Request Full Portfolio
            <i className="ri-file-list-3-line"></i>
          </motion.button>
        </motion.div>
      </div>

      {/* Lightbox overlay */}
      <PortfolioLightbox project={lightboxProject} onClose={() => setLightboxProject(null)} />

      {/* Live Preview Modal */}
      <LivePreviewModal project={livePreviewProject} onClose={() => setLivePreviewProject(null)} />
    </section>
  );
}