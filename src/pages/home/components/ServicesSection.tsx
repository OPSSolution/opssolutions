import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { use3DTilt } from "@/hooks/use3DTilt";
import AnimatedText from "@/components/base/AnimatedText";
import TechStackShelf from "@/pages/home/components/TechStackShelf";

const services = [
  {
    icon: "ri-code-s-slash-line",
    title: "Software Development",
    description: "Custom applications and systems built for real business needs.",
    tags: ["React", "Node.js", "TypeScript"],
    slug: "web-development",
    number: "01",
  },
  {
    icon: "ri-smartphone-line",
    title: "Website Design",
    description: "Professional, responsive websites that convert.",
    tags: ["React Native", "Flutter", "iOS", "Android"],
    slug: "mobile-development",
    number: "02",
  },
  {
    icon: "ri-cloud-line",
    title: "Digital Systems Integration",
    description: "Connecting tools, data, and workflows into one efficient system.",
    tags: ["AWS", "Docker", "Kubernetes"],
    slug: "cloud-architecture",
    number: "03",
  },
  {
    icon: "ri-palette-line",
    title: "E-Commerce Development",
    description: "Storefronts and marketplace solutions ready to scale.",
    tags: ["Figma", "Design Systems", "Prototyping"],
    slug: "ui-ux-design",
    number: "04",
  },
  {
    icon: "ri-robot-line",
    title: "Business Technology Consulting",
    description: "Guidance on digital transformation and operational efficiency.",
    tags: ["OpenAI", "TensorFlow", "LangChain"],
    slug: "ai-ml-integration",
    number: "05",
  },
  {
    icon: "ri-git-branch-line",
    title: "Tech Center (Sub-Project)",
    description: "R&D hub supporting the young generation to research & develop new technology — AI & ML, software, hardware & IoT, youth incubation.",
    tags: ["GitHub Actions", "Terraform", "Datadog"],
    slug: "devops-cicd",
    number: "06",
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number; }) {
  const navigate = useNavigate();
  const inViewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(inViewRef, { once: true, margin: "-80px" });
  const { cardRef, rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt({ maxRotateX: 8, maxRotateY: 12 });

  return (
    <motion.div
      ref={(el) => {
        (inViewRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{
        duration: 0.75,
        delay: (index % 3) * 0.12 + Math.floor(index / 3) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={() => navigate(`/services/${service.slug}`)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-service-card={index}
      className="group relative bg-dc-card border border-dc-text/6 rounded-2xl p-8 flex flex-col gap-5 hover:border-accent/35 transition-colors duration-400 cursor-pointer overflow-hidden"
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }}
    >
      {/* Background number — reveals on hover */}
      <motion.span
        className="absolute top-4 right-5 text-8xl font-bold font-mono text-dc-text/[0.03] select-none leading-none pointer-events-none"
        initial={{ opacity: 0, x: 16 }}
        whileHover={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
      >
        {service.number}
      </motion.span>

      {/* Accent corner flash on hover */}
      <motion.div
        className="absolute top-0 right-0 w-16 h-16 rounded-bl-3xl bg-accent/0 pointer-events-none"
        whileHover={{ background: "rgba(41,171,226,0.06)" }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon */}
      <motion.div
        className="w-12 h-12 flex items-center justify-center rounded-xl bg-dc-text/5 group-hover:bg-accent/12 border border-transparent group-hover:border-accent/20 transition-all duration-350"
        whileHover={{ scale: 1.12, rotate: -6 }}
        transition={{ type: "spring", stiffness: 350, damping: 18 }}
      >
        <i className={`${service.icon} text-2xl text-dc-text/60 group-hover:text-accent transition-colors duration-300`}></i>
      </motion.div>

      <div>
        <h3 className="text-dc-text font-semibold text-xl mb-2 group-hover:text-accent transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-dc-text/45 text-sm leading-relaxed">{service.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        {service.tags.map((tag, ti) => (
          <motion.span
            key={tag}
            className="text-xs font-mono text-dc-text/30 bg-dc-text/5 px-3 py-1 rounded-full group-hover:text-dc-text/50 group-hover:bg-dc-text/8 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: (index % 3) * 0.12 + 0.35 + ti * 0.05 }}
          >
            {tag}
          </motion.span>
        ))}
      </div>

      <div className="flex items-center gap-2 text-accent/50 text-sm font-medium group-hover:text-accent transition-colors duration-300">
        <span>Learn more</span>
        <motion.i
          className="ri-arrow-right-line"
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 400 }}
        />
      </div>

      {/* Bottom glow line */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-accent/0 via-accent to-accent/0"
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.45 }}
        style={{ transformOrigin: "center" }}
      />
    </motion.div>
  );
}

export default function ServicesSection() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="services" className="bg-dc-bg py-28 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <div>
            {/* Label — chars reveal */}
            <div className="overflow-hidden mb-4">
              <motion.p
                className="text-accent text-sm font-mono tracking-widest"
                initial={{ y: 20, opacity: 0 }}
                animate={headerInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                WHAT WE DO
              </motion.p>
            </div>
            {/* Headline — word by word */}
            <h2 className="text-4xl md:text-6xl font-bold leading-tight flex flex-wrap gap-x-[0.25em]">
              <AnimatedText
                text="Our"
                as="span"
                className="text-dc-text text-4xl md:text-6xl font-bold leading-tight"
                delay={0.12}
                stagger={0.08}
              />
              <AnimatedText
                text="Services"
                as="span"
                className="text-accent text-4xl md:text-6xl font-bold leading-tight"
                delay={0.22}
                stagger={0.065}
                mode="chars"
              />
            </h2>
          </div>
          <motion.p
            className="text-dc-text/45 text-base max-w-sm md:text-right leading-relaxed"
            initial={{ opacity: 0, x: 20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            From concept to deployment, we cover the full spectrum of software engineering services.
          </motion.p>
        </div>

        {/* Divider reveal */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mb-16"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left" }}
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

        {/* Tech Stack Shelf — fixed right-edge observer */}
        <TechStackShelf />

        {/* Recruiting strip */}
        <motion.div
          className="mt-14 bg-dc-card border border-dc-text/6 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-5"
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent/10 shrink-0"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <i className="ri-team-line text-accent text-lg"></i>
            </motion.div>
            <div>
              <p className="text-dc-text font-semibold text-sm">We&apos;re hiring world-class engineers across all these disciplines.</p>
              <p className="text-dc-text/40 text-xs mt-0.5">Join 60+ engineers building products used by millions.</p>
            </div>
          </div>
          <motion.button
            onClick={() => navigate("/careers")}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-accent text-black text-sm font-bold px-6 py-3 rounded-full hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap shrink-0"
          >
            View Open Roles
            <i className="ri-arrow-right-line"></i>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}