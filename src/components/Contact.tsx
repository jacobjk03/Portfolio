"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Phone, Send, CheckCircle, AlertCircle } from "lucide-react";
import { resumeData } from "@/config/resume-data";
import emailjs from "@emailjs/browser";
import { Scroll3DReveal } from "@/components/Scroll3DReveal";
import { SectionNumber } from "@/components/SectionNumber";
import { ScrollTiltSection } from "@/components/ScrollTiltSection";

const EMAILJS_PUBLIC_KEY = "Lcf71Be-dQHjlqah-";
const EMAILJS_SERVICE_ID = "service_pwj70j5";
const EMAILJS_TEMPLATE_ID = "template_voc2hhi";

// ── Option A: Typewriter heading ──────────────────────────────────────────────
function TypewriterHeading({ text, trigger }: { text: string; trigger: boolean }) {
  const [displayed, setDisplayed] = useState("");
  const [cursorOn, setCursorOn] = useState(true);
  const hasRun = useRef(false);
  const done = displayed.length === text.length && trigger;

  useEffect(() => {
    if (!trigger || hasRun.current) return;
    hasRun.current = true;
    let i = 0;
    const start = setTimeout(() => {
      const tick = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(tick);
      }, 46);
      return () => clearInterval(tick);
    }, 350);
    return () => clearTimeout(start);
  }, [trigger, text]);

  // Blink only after typing finishes
  useEffect(() => {
    if (!done) return;
    const id = setInterval(() => setCursorOn(v => !v), 520);
    return () => clearInterval(id);
  }, [done]);

  return (
    <span>
      {trigger ? displayed : ""}
      <span
        className="inline-block w-[3px] rounded-sm align-middle ml-0.5 bg-foreground"
        style={{
          height: "0.82em",
          opacity: done ? (cursorOn ? 1 : 0) : trigger ? 1 : 0,
          transition: "opacity 0s",
        }}
      />
    </span>
  );
}

// ── Option B: Glowing focus field wrapper ─────────────────────────────────────
function FocusField({
  label,
  focused,
  children,
}: {
  label: string;
  focused: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        className="block text-[10px] font-semibold tracking-[0.12em] uppercase mb-2 transition-colors duration-200"
        style={{ color: focused ? "rgb(124,58,237)" : "rgba(var(--foreground-rgb, 0 0 0) / 0.4)" }}
      >
        {label}
      </label>
      <div className="relative">
        {children}

        {/* Glow ring on focus */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            boxShadow: focused
              ? "0 0 0 1px rgba(124,58,237,0.55), 0 0 16px rgba(124,58,237,0.12)"
              : "0 0 0 0px rgba(124,58,237,0)",
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />

        {/* Left-to-right sweep underline */}
        <motion.div
          className="absolute bottom-0 left-0 h-[1.5px] bg-primary pointer-events-none"
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformOrigin: "left", originX: 0 }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !isValidEmail(formData.email) || !formData.message.trim()) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }
    setStatus("sending");
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
      }, EMAILJS_PUBLIC_KEY);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error("[EmailJS error]", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const baseInput = "w-full px-4 py-3 bg-background border border-foreground/15 text-foreground text-sm placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors duration-200 disabled:opacity-40";

  return (
    <section id="contact" className="py-28 border-b border-foreground/8 relative overflow-hidden" ref={ref}>
      <SectionNumber number="08" />
      <ScrollTiltSection>
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <Scroll3DReveal>
            <span className="editorial-label block mb-4">Get In Touch</span>
            <h2 className="font-serif font-medium text-3xl md:text-4xl text-foreground max-w-xl min-h-[1.2em]">
              <TypewriterHeading
                text="Let's build something together."
                trigger={isInView}
              />
            </h2>
          </Scroll3DReveal>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-0">

          {/* Left: contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:pr-16 lg:border-r border-foreground/10 space-y-12 pb-16 lg:pb-0"
          >
            <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
              Open to full-time roles, freelance projects, and research collaborations.
              I'll get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              {[
                { Icon: Mail, label: "Email", value: resumeData.personal.email, href: `mailto:${resumeData.personal.email}` },
                { Icon: Phone, label: "Phone", value: resumeData.personal.phone, href: `tel:${resumeData.personal.phone}` },
                { Icon: MapPin, label: "Location", value: resumeData.personal.location, href: null },
              ].map(({ Icon, label, value, href }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-9 h-9 border border-foreground/12 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-foreground/40 mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm text-foreground hover:text-primary transition-colors">{value}</a>
                    ) : (
                      <p className="text-sm text-foreground">{value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground/50">
                Available for work
              </span>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:pl-16 pt-16 lg:pt-0"
          >
            <form onSubmit={handleSubmit} className="space-y-5">

              <FocusField label="Name" focused={focusedField === "name"}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  disabled={status === "sending"}
                  placeholder="Your full name"
                  className={baseInput}
                />
              </FocusField>

              <FocusField label="Email" focused={focusedField === "email"}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  disabled={status === "sending"}
                  placeholder="your@email.com"
                  className={baseInput}
                />
              </FocusField>

              <FocusField label="Message" focused={focusedField === "message"}>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  disabled={status === "sending"}
                  rows={5}
                  placeholder="Tell me about your project or opportunity..."
                  className={`${baseInput} resize-none`}
                />
              </FocusField>

              <motion.button
                type="submit"
                disabled={status === "sending" || status === "success"}
                animate={status === "error" ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                transition={{ duration: 0.35 }}
                data-ripple="true" data-ripple-color="rgba(255,255,255,0.25)"
                className={`btn-shimmer w-full py-4 text-[11px] font-semibold tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all ${
                  status === "success"
                    ? "bg-green-600 text-white"
                    : status === "error"
                    ? "bg-red-500/10 border border-red-400 text-red-500"
                    : "bg-primary text-white disabled:opacity-60"
                }`}
              >
                {status === "sending" ? (
                  <>
                    <motion.div
                      className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    Sending…
                  </>
                ) : status === "success" ? (
                  <><CheckCircle className="w-4 h-4" /> Message sent</>
                ) : status === "error" ? (
                  <><AlertCircle className="w-4 h-4" /> Check your fields and try again</>
                ) : (
                  <><Send className="w-3.5 h-3.5" /> Send Message</>
                )}
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>
      </ScrollTiltSection>
    </section>
  );
}
