"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Phone, Send, CheckCircle, AlertCircle } from "lucide-react";
import { resumeData } from "@/config/resume-data";
import emailjs from "@emailjs/browser";
import { Scroll3DReveal } from "@/components/Scroll3DReveal";
import { SectionNumber } from "@/components/SectionNumber";

const EMAILJS_PUBLIC_KEY = "Lcf71Be-dQHjlqah-";
const EMAILJS_SERVICE_ID = "service_k08yehc";
const EMAILJS_TEMPLATE_ID = "template_voc2hhi";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

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
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-background border border-foreground/15 text-foreground text-sm placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors disabled:opacity-40";

  return (
    <section id="contact" className="py-28 border-b border-foreground/8 relative overflow-hidden" ref={ref}>
      {/* Section number */}
      <SectionNumber number="08" />

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
            <h2 className="font-serif font-medium text-3xl md:text-4xl text-foreground max-w-xl">
              Let's build something together.
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
              ].map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
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
                </div>
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
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-foreground/50 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status === "sending"}
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-foreground/50 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status === "sending"}
                  placeholder="your@email.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-foreground/50 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={status === "sending"}
                  rows={5}
                  placeholder="Tell me about your project or opportunity..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === "sending" || status === "success"}
                animate={status === "error" ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                transition={{ duration: 0.35 }}
                className={`w-full py-4 text-[11px] font-semibold tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all ${
                  status === "success"
                    ? "bg-green-600 text-white"
                    : status === "error"
                    ? "bg-red-500/10 border border-red-400 text-red-500"
                    : "bg-primary text-white hover:brightness-110 disabled:opacity-60"
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
    </section>
  );
}
