import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  roleTitle: string;
  onClose: () => void;
}

export default function ApplicationModal({ roleTitle, onClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 500;

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = new URLSearchParams();
    data.forEach((val, key) => body.append(key, val as string));
    setStatus("loading");
    try {
      const res = await fetch("https://readdy.ai/api/form/d82bka52rv787lut0rgg", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Panel */}
        <motion.div
          className="relative z-10 bg-[#131009] border border-white/8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#131009]/95 backdrop-blur-md border-b border-white/5 px-7 py-5 flex items-center justify-between z-10">
            <div>
              <p className="text-accent text-xs font-mono tracking-widest mb-0.5">APPLY NOW</p>
              <h2 className="text-white font-bold text-lg leading-snug">{roleTitle}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <i className="ri-close-line text-lg" />
            </button>
          </div>

          {/* Body */}
          <div className="px-7 py-6">
            {status === "success" ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-16 h-16 flex items-center justify-center bg-accent/15 rounded-full mx-auto mb-5">
                  <i className="ri-check-line text-accent text-2xl" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Application received!</h3>
                <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">
                  Thanks for applying for <strong className="text-white/70">{roleTitle}</strong>. We review every application and respond within 48 hours.
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 inline-flex items-center gap-2 bg-accent text-black font-bold px-6 py-3 rounded-full hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap text-sm"
                >
                  Close
                  <i className="ri-arrow-right-line" />
                </button>
              </motion.div>
            ) : (
              <form
                ref={formRef}
                data-readdy-form
                id="job-application-form"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Role field (hidden pre-fill) */}
                <input type="hidden" name="role" value={roleTitle} />

                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-xs font-mono mb-2 block tracking-wide">FULL NAME *</label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      placeholder="Jane Smith"
                      className="w-full bg-white/5 border border-white/10 focus:border-accent/40 text-white text-sm placeholder:text-white/20 rounded-xl px-4 py-3.5 outline-none transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-mono mb-2 block tracking-wide">EMAIL *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="jane@company.com"
                      className="w-full bg-white/5 border border-white/10 focus:border-accent/40 text-white text-sm placeholder:text-white/20 rounded-xl px-4 py-3.5 outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Phone + Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-xs font-mono mb-2 block tracking-wide">PHONE</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 555 000 0000"
                      className="w-full bg-white/5 border border-white/10 focus:border-accent/40 text-white text-sm placeholder:text-white/20 rounded-xl px-4 py-3.5 outline-none transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-mono mb-2 block tracking-wide">CURRENT LOCATION *</label>
                    <input
                      type="text"
                      name="location"
                      required
                      placeholder="City, Country"
                      className="w-full bg-white/5 border border-white/10 focus:border-accent/40 text-white text-sm placeholder:text-white/20 rounded-xl px-4 py-3.5 outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Years of experience */}
                <div>
                  <label className="text-white/40 text-xs font-mono mb-2 block tracking-wide">YEARS OF EXPERIENCE *</label>
                  <select
                    name="years_experience"
                    required
                    defaultValue=""
                    className="w-full bg-white/5 border border-white/10 focus:border-accent/40 text-white text-sm rounded-xl px-4 py-3.5 outline-none transition-colors duration-300 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#131009]">Select range</option>
                    <option value="1-2 years" className="bg-[#131009]">1 – 2 years</option>
                    <option value="3-5 years" className="bg-[#131009]">3 – 5 years</option>
                    <option value="5-8 years" className="bg-[#131009]">5 – 8 years</option>
                    <option value="8-12 years" className="bg-[#131009]">8 – 12 years</option>
                    <option value="12+ years" className="bg-[#131009]">12+ years</option>
                  </select>
                </div>

                {/* Portfolio + LinkedIn */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-xs font-mono mb-2 block tracking-wide">PORTFOLIO / GITHUB URL</label>
                    <input
                      type="url"
                      name="portfolio_url"
                      placeholder="https://github.com/yourhandle"
                      className="w-full bg-white/5 border border-white/10 focus:border-accent/40 text-white text-sm placeholder:text-white/20 rounded-xl px-4 py-3.5 outline-none transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-mono mb-2 block tracking-wide">LINKEDIN URL</label>
                    <input
                      type="url"
                      name="linkedin_url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full bg-white/5 border border-white/10 focus:border-accent/40 text-white text-sm placeholder:text-white/20 rounded-xl px-4 py-3.5 outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* How did you hear */}
                <div>
                  <label className="text-white/40 text-xs font-mono mb-2 block tracking-wide">HOW DID YOU HEAR ABOUT US?</label>
                  <select
                    name="referral_source"
                    defaultValue=""
                    className="w-full bg-white/5 border border-white/10 focus:border-accent/40 text-white text-sm rounded-xl px-4 py-3.5 outline-none transition-colors duration-300 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#131009]">Select source</option>
                    <option value="LinkedIn" className="bg-[#131009]">LinkedIn</option>
                    <option value="Twitter / X" className="bg-[#131009]">Twitter / X</option>
                    <option value="Referral from employee" className="bg-[#131009]">Referral from current employee</option>
                    <option value="Job board" className="bg-[#131009]">Job board (Indeed, Wellfound, etc.)</option>
                    <option value="Our blog" className="bg-[#131009]">Found your blog</option>
                    <option value="Other" className="bg-[#131009]">Other</option>
                  </select>
                </div>

                {/* Cover message */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white/40 text-xs font-mono tracking-wide">COVER MESSAGE *</label>
                    <span className={`text-xs font-mono ${charCount > MAX_CHARS ? "text-red-400" : "text-white/25"}`}>
                      {charCount} / {MAX_CHARS}
                    </span>
                  </div>
                  <textarea
                    name="cover_message"
                    required
                    rows={5}
                    maxLength={MAX_CHARS}
                    placeholder="Tell us why you're excited about this role, what makes you a great fit, and one project you're proud of..."
                    onChange={(e) => setCharCount(e.target.value.length)}
                    className="w-full bg-white/5 border border-white/10 focus:border-accent/40 text-white text-sm placeholder:text-white/20 rounded-xl px-4 py-3.5 outline-none transition-colors duration-300 resize-none"
                  />
                  {charCount > MAX_CHARS && (
                    <p className="text-red-400/80 text-xs mt-1">Message exceeds 500 characters.</p>
                  )}
                </div>

                {/* Notice period */}
                <div>
                  <label className="text-white/40 text-xs font-mono mb-2 block tracking-wide">NOTICE PERIOD / AVAILABILITY *</label>
                  <select
                    name="availability"
                    required
                    defaultValue=""
                    className="w-full bg-white/5 border border-white/10 focus:border-accent/40 text-white text-sm rounded-xl px-4 py-3.5 outline-none transition-colors duration-300 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#131009]">When can you start?</option>
                    <option value="Immediately" className="bg-[#131009]">Immediately</option>
                    <option value="2 weeks" className="bg-[#131009]">2 weeks notice</option>
                    <option value="1 month" className="bg-[#131009]">1 month notice</option>
                    <option value="2 months" className="bg-[#131009]">2 months notice</option>
                    <option value="3+ months" className="bg-[#131009]">3+ months</option>
                  </select>
                </div>

                {/* Submit */}
                {status === "error" && (
                  <p className="text-red-400/80 text-xs text-center">Something went wrong. Please try again.</p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading" || charCount > MAX_CHARS}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-black font-bold px-8 py-4 rounded-xl hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap disabled:opacity-60 text-sm"
                >
                  {status === "loading" ? (
                    <><i className="ri-loader-4-line animate-spin" /> Sending Application...</>
                  ) : (
                    <><i className="ri-send-plane-line" /> Submit Application</>
                  )}
                </button>
                <p className="text-white/20 text-xs text-center">
                  We respond to every application within 48 hours.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}