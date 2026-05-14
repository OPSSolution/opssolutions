import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const team = [
  {
    id: 1,
    name: "Jordan Mitchell",
    role: "CEO & Founder",
    bio: "Former CTO at two unicorn startups. Led engineering orgs of 120+ at Scale.ai. Built Solutions to be the software studio he always wished existed.",
    image: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20confident%20male%20CEO%20tech%20executive%2C%2040s%2C%20dark%20blazer%2C%20short%20hair%2C%20clean%20studio%20background%2C%20warm%20studio%20lighting%2C%20sharp%20focus%2C%20premium%20business%20portrait%20photography&width=400&height=500&seq=team_01&orientation=portrait",
    social: { linkedin: "#", twitter: "#", github: "#" },
    tag: "Leadership",
    tagAccent: true,
  },
  {
    id: 2,
    name: "Yuki Tanaka",
    role: "Principal Engineer",
    bio: "Ex-Meta Platform Engineer. Authored 3 open-source npm packages with 500k+ weekly downloads. React and TypeScript architecture specialist.",
    image: "https://readdy.ai/api/search-image?query=professional%20headshot%20female%20senior%20software%20engineer%2C%20Asian%20woman%2C%2030s%2C%20casual%20tech%20professional%20attire%2C%20dark%20studio%20background%2C%20confident%20smile%2C%20sharp%20focus%2C%20modern%20portrait%20photography&width=400&height=500&seq=team_02&orientation=portrait",
    social: { linkedin: "#", twitter: "#", github: "#" },
    tag: "Engineering",
    tagAccent: false,
  },
  {
    id: 3,
    name: "Carlos Mendez",
    role: "Head of Product Design",
    bio: "Design lead for products serving 20M+ users. Previously at Figma's design consulting practice. Creator of the OpenUI open-source component library.",
    image: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20creative%20male%20UX%20designer%2C%20Hispanic%20man%2C%2030s%2C%20stylish%20casual%20attire%2C%20warm%20neutral%20studio%20background%2C%20artistic%20lighting%2C%20confident%20expression%2C%20premium%20portrait%20photography&width=400&height=500&seq=team_03&orientation=portrait",
    social: { linkedin: "#", twitter: "#", github: "#" },
    tag: "Design",
    tagAccent: true,
  },
  {
    id: 4,
    name: "Anya Volkov",
    role: "Cloud Infrastructure Lead",
    bio: "AWS Hero and Kubernetes contributor. Migrated 30+ legacy monoliths to cloud-native. Cuts average infrastructure costs by 55% per client engagement.",
    image: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20female%20DevOps%20engineer%2C%20European%20woman%2C%20early%2030s%2C%20smart%20casual%20professional%20attire%2C%20clean%20studio%20background%2C%20natural%20confident%20expression%2C%20premium%20portrait%20photography&width=400&height=500&seq=team_04&orientation=portrait",
    social: { linkedin: "#", twitter: "#", github: "#" },
    tag: "Infrastructure",
    tagAccent: false,
  },
  {
    id: 5,
    name: "Kai Nakamura",
    role: "Mobile Engineering Lead",
    bio: "Built apps for Nike, Starbucks, and Adobe. Has 12 apps in the App Store top 100. React Native and Flutter expert with a product-first mindset.",
    image: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20male%20mobile%20developer%2C%20Korean%20man%2C%20late%2020s%2C%20wearing%20casual%20tech%20company%20t-shirt%2C%20modern%20studio%20background%2C%20friendly%20professional%20expression%2C%20sharp%20focus%20portrait%20photography&width=400&height=500&seq=team_05&orientation=portrait",
    social: { linkedin: "#", twitter: "#", github: "#" },
    tag: "Mobile",
    tagAccent: true,
  },
  {
    id: 6,
    name: "Dr. Nadia Hassan",
    role: "AI/ML Lead",
    bio: "Research scientist with 8 published papers on transformer architectures. Built AI features used by 5M+ daily active users across three product lines.",
    image: "https://readdy.ai/api/search-image?query=professional%20headshot%20female%20AI%20researcher%20data%20scientist%2C%20Black%20woman%2C%2030s%2C%20professional%20smart%20casual%20attire%2C%20minimal%20dark%20background%2C%20intelligent%20focused%20expression%2C%20premium%20high-quality%20portrait%20photography&width=400&height=500&seq=team_06&orientation=portrait",
    social: { linkedin: "#", twitter: "#", github: "#" },
    tag: "AI/ML",
    tagAccent: false,
  },
];

function TeamCard({ member, index }: { member: typeof team[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay: (index % 3) * 0.13, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative bg-dc-card border border-dc-text/6 rounded-2xl overflow-hidden hover:border-accent/25 transition-colors duration-350 cursor-pointer"
      whileHover={{ y: -8, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
    >
      {/* Image */}
      <div className="relative w-full h-72 overflow-hidden">
        <motion.img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-top"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dc-card via-dc-card/10 to-transparent" />
        <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full ${member.tagAccent ? "bg-accent text-black" : "bg-dc-text/10 text-dc-text"}`}>
          {member.tag}
        </span>

        {/* Social overlay on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 flex items-end justify-end p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex gap-2">
                {[
                  { href: member.social.linkedin, icon: "ri-linkedin-fill" },
                  { href: member.social.twitter, icon: "ri-twitter-x-fill" },
                  { href: member.social.github, icon: "ri-github-fill" },
                ].map((s, si) => (
                  <motion.a
                    key={s.icon}
                    href={s.href}
                    rel="nofollow noopener"
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm text-white/70 hover:text-accent hover:bg-black/80 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: si * 0.05 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className={`${s.icon} text-sm`}></i>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-dc-text font-bold text-lg mb-0.5 group-hover:text-accent transition-colors duration-300">
          {member.name}
        </h3>
        <p className="text-accent/70 text-sm font-medium mb-3">{member.role}</p>
        <p className="text-dc-text/40 text-xs leading-relaxed">{member.bio}</p>
      </div>

      {/* Glow border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: hovered ? "inset 0 0 0 1px rgba(185,255,75,0.22)" : "inset 0 0 0 1px rgba(185,255,75,0)",
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export default function TeamSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="team" className="bg-dc-surface py-28 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          <motion.p
            className="text-accent text-sm font-mono tracking-widest mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            THE PEOPLE
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              className="text-4xl md:text-6xl font-bold text-dc-text"
              initial={{ y: "110%" }}
              animate={headerInView ? { y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              Meet Our <span className="text-accent">Team</span>
            </motion.h2>
          </div>
          <motion.p
            className="text-dc-text/35 text-base mt-4 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.35 }}
          >
            A handpicked collective of senior engineers, designers, and strategists who have shipped products used by tens of millions of people.
          </motion.p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {team.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} />
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-dc-text/25 text-sm mb-2">We are always looking for exceptional talent.</p>
          <motion.a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 text-accent text-sm font-medium hover:underline cursor-pointer whitespace-nowrap"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            View Open Positions <i className="ri-arrow-right-line"></i>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}