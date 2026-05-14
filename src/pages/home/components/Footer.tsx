import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const footerLinks = {
  Services: [
    { label: "Web Development", href: "#services" },
    { label: "Mobile Development", href: "#services" },
    { label: "Cloud Architecture", href: "#services" },
    { label: "UI/UX Design", href: "#services" },
    { label: "AI Integration", href: "#services" },
  ],
  Company: [
    { label: "About Us", href: "#home" },
    { label: "Our Team", href: "#team" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "How We Work", href: "/process" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Industries", href: "/industries" },
    { label: "Pricing", href: "/pricing" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#home" },
    { label: "Terms of Service", href: "#home" },
    { label: "Cookie Policy", href: "#home" },
  ],
};

const socials = [
  { icon: "ri-twitter-x-fill", label: "Twitter", href: "https://twitter.com/devcraftstudio" },
  { icon: "ri-linkedin-fill", label: "LinkedIn", href: "https://linkedin.com/company/devcraftstudio" },
  { icon: "ri-github-fill", label: "GitHub", href: "https://github.com/devcraftstudio" },
  { icon: "ri-dribbble-line", label: "Dribbble", href: "#" },
  { icon: "ri-instagram-line", label: "Instagram", href: "#" },
];

export default function Footer() {
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    if (href.startsWith("/")) {
      navigate(href);
      return;
    }
    const id = href.replace("#", "");
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-dc-surface border-t border-dc-text/5">
      {/* CTA Strip */}
      <div className="border-b border-dc-text/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-dc-text/30 text-xs font-mono tracking-widest mb-1">READY TO START?</p>
            <h3 className="text-2xl md:text-3xl font-bold text-dc-text">
              Let&apos;s build your next big thing.
            </h3>
          </motion.div>
          <motion.button
            onClick={() => handleNavClick("#contact")}
            className="flex items-center gap-2 bg-accent text-black font-semibold px-8 py-4 rounded-full whitespace-nowrap text-sm hover:bg-white transition-colors duration-300 cursor-pointer shrink-0"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            Start a Project
            <i className="ri-arrow-right-line text-base"></i>
          </motion.button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <button
              onClick={() => handleNavClick("#home")}
              className="inline-flex items-center gap-3 mb-6 cursor-pointer"
            >
              <img
                src="https://static.readdy.ai/image/27f36426f3cab7c4efebb6eb9e24cb04/3338f66b55262222ff9be144548b1ced.png"
                alt="Solutions Studio"
                className="h-12 w-auto object-contain"
              />
              <span className="text-dc-text font-bold text-2xl">
                Solutions<span className="text-accent">.</span>
              </span>
            </button>
            <p className="text-dc-text/30 text-sm leading-relaxed max-w-xs mb-6">
              Building digital excellence, one line at a time. Premium software development for ambitious companies worldwide.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  rel="nofollow noopener"
                  target="_blank"
                  aria-label={social.label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-dc-text/5 hover:bg-accent/20 hover:text-accent text-dc-text/40 transition-all duration-300 cursor-pointer"
                >
                  <i className={`${social.icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Nav Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-dc-text font-semibold text-sm mb-5">
                <a
                  href={links[0].href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(links[0].href); }}
                  className="text-dc-text hover:text-accent transition-colors duration-200"
                >
                  {category}
                </a>
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                      className="text-dc-text/35 text-sm hover:text-accent transition-colors duration-200 cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dc-text/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dc-text/20 text-xs font-mono">
            &copy; 2026 Solutions Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-dc-text/20 text-xs">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow inline-block"></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}