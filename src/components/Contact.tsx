"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Phone, Send, CheckCircle, AlertCircle } from "lucide-react";
import { resumeData } from "@/config/resume-data";
import emailjs from '@emailjs/browser';
import { UplinkInitPanel } from "./UplinkInitPanel";
import { SecureMessageForm } from "./SecureMessageForm";

/**
 * Contact Component with Futuristic AI Cyber-Upload Animation
 * 
 * Features:
 * - Neural Transmission Uplink Chamber experience
 * - Neon beam data uplink animation on form submission
 * - Particle effects rising in cyber beam
 * - Sequential loading states: Encrypting → Sending → Confirmed
 * - Circuit-style glow pulses around button
 * - Glowing checkmark with sparkle particles on success
 * - Button shake animation on error
 * - Premium cyber aesthetic (OpenAI/Neuralink vibes)
 * - Form inputs disabled during submission
 * - Professional, non-blocking animations using Framer Motion
 */
export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [uplinkInitiated, setUplinkInitiated] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [uploadPhase, setUploadPhase] = useState<"encrypting" | "sending" | "confirming" | "done">("encrypting");
  const [isHovering, setIsHovering] = useState(false);
  const [systemFlicker, setSystemFlicker] = useState(false);
  const [shockwaveActive, setShockwaveActive] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleUplinkComplete = () => {
    setUplinkInitiated(true);
  };

  // ============================================
  // 📧 EMAILJS CONFIGURATION
  // ============================================
  // Paste your EmailJS credentials here:
  // 
  // 1. EmailJS Public Key: Get from https://dashboard.emailjs.com/admin/integration
  // 2. EmailJS Service ID: Get from https://dashboard.emailjs.com/admin/service
  // 3. EmailJS Template ID: Get from https://dashboard.emailjs.com/admin/template
  //
  // Make sure your EmailJS service is configured to use Gmail!
  // ============================================
  const EMAILJS_PUBLIC_KEY = "Lcf71Be-dQHjlqah-"; // ⬅️ PASTE YOUR PUBLIC KEY HERE
  const EMAILJS_SERVICE_ID = "service_k08yehc"; // ⬅️ PASTE YOUR SERVICE ID HERE
  const EMAILJS_TEMPLATE_ID = "template_voc2hhi"; // ⬅️ PASTE YOUR TEMPLATE ID HERE

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!formData.name.trim()) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    if (!formData.message.trim()) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }
    
    // Trigger system flicker effect
    setSystemFlicker(true);
    setTimeout(() => setSystemFlicker(false), 200);
    
    // Start cyber upload animation sequence
    setStatus("sending");
    setUploadPhase("encrypting");

    // Phase 1: Encrypting (800ms)
    setTimeout(() => setUploadPhase("sending"), 800);

    // Phase 2: Sending + EmailJS call (1200ms after start)
    setTimeout(async () => {
      setUploadPhase("confirming");
      
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
          },
          EMAILJS_PUBLIC_KEY
        );

        // Phase 3: Delivery confirmed
        setTimeout(() => {
          setUploadPhase("done");
          setStatus("success");
          
          // Trigger cinematic shockwave effect on success!
          triggerShockwave();
          
          setFormData({ name: "", email: "", message: "" });
          setTimeout(() => setStatus("idle"), 3000);
        }, 200);
      } catch (error) {
        console.error("EmailJS Error:", error);
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Trigger smooth transmission pulse effect on success
  const triggerShockwave = () => {
    // Debounce: prevent rapid triggers
    if (shockwaveActive) return;
    
    setShockwaveActive(true);
    
    // Add shockwave class to body for smooth camera shake
    document.body.classList.add('screen-shockwave');
    
    // Add glow pulse to button
    if (buttonRef.current) {
      buttonRef.current.classList.add('transmit-pulse');
      setTimeout(() => {
        buttonRef.current?.classList.remove('transmit-pulse');
      }, 250);
    }
    
    // Remove after animation completes (300ms + small buffer)
    setTimeout(() => {
      document.body.classList.remove('screen-shockwave');
      setShockwaveActive(false);
    }, 350);
  };

  return (
    <>
      {/* System Flicker Effect - AI Signal Handshake */}
      <AnimatePresence>
        {systemFlicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.15, 0, 0.1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.2,
              times: [0, 0.3, 0.5, 0.8, 1],
              ease: "easeInOut",
            }}
            className="fixed inset-0 z-[10000] pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, rgba(123, 97, 255, 0.3) 0%, rgba(0, 255, 231, 0.2) 50%, transparent 100%)",
              mixBlendMode: "screen",
            }}
          />
        )}
      </AnimatePresence>

      <section 
        id="contact" 
        className="py-20" 
        ref={ref}
        style={{
          filter: systemFlicker ? "brightness(1.1) saturate(1.2)" : "none",
          transition: "filter 0.2s ease-out",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!uplinkInitiated ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-4" />
              <p className="text-muted-foreground max-w-2xl mx-auto">
                I'm always open to new opportunities and interesting projects. 
                Let's connect and create something amazing together!
              </p>
            </motion.div>

            <UplinkInitPanel onComplete={handleUplinkComplete} />
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-4" />
              <p className="text-muted-foreground max-w-2xl mx-auto">
                I'm always open to new opportunities and interesting projects. 
                Let's connect and create something amazing together!
              </p>
            </motion.div>

            <SecureMessageForm isRevealed={uplinkInitiated}>
              <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <p className="text-muted-foreground mb-8">
                Feel free to reach out through any of these channels. I'll get back to you as soon as possible!
              </p>
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 transition-all"
                >
                  <div className="p-3 rounded-full bg-primary/10">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${resumeData.personal.email}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {resumeData.personal.email}
                    </a>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 transition-all"
                >
                  <div className="p-3 rounded-full bg-primary/10">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a
                      href={`tel:${resumeData.personal.phone}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {resumeData.personal.phone}
                    </a>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 transition-all"
                >
                  <div className="p-3 rounded-full bg-primary/10">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{resumeData.personal.location}</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Availability */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Currently Available
              </h4>
              <p className="text-sm text-muted-foreground">
                Open to freelance projects, full-time opportunities, and collaborations
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={status === "sending"}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={status === "sending"}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={status === "sending"}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Futuristic AI Cyber-Upload Button */}
              <div className="relative">
                {/* Circuit Glow Pulse - appears during sending */}
                <AnimatePresence>
                  {status === "sending" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -inset-2 rounded-xl bg-gradient-to-r from-[#8A2BE2] via-[#00CFFF] to-[#8A2BE2] blur-xl"
                      style={{ zIndex: -1 }}
                    />
                  )}
                </AnimatePresence>

                <motion.button
                  ref={buttonRef}
                  type="submit"
                  disabled={status === "sending"}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  animate={
                    status === "error"
                      ? {
                          x: [0, -10, 10, -10, 10, 0],
                          transition: { duration: 0.4 },
                        }
                      : {}
                  }
                  whileHover={
                    status === "idle"
                      ? {
                          scale: 1.02,
                        }
                      : {}
                  }
                  whileTap={status === "idle" ? { scale: 0.98 } : {}}
                  className={`w-full px-6 py-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-lg relative overflow-visible ${
                    status === "error"
                      ? "bg-red-500/10 border-2 border-red-500 text-red-500"
                      : status === "success"
                      ? "bg-gradient-to-r from-[#8A2BE2]/20 to-[#00CFFF]/20 border-2 border-[#00CFFF] text-[#00CFFF]"
                      : status === "sending"
                      ? "bg-gradient-to-r from-[#8A2BE2]/30 to-[#00CFFF]/30 border-2 border-[#8A2BE2] text-white"
                      : "bg-primary text-primary-foreground hover:shadow-xl"
                  } ${status === "sending" ? "cursor-not-allowed" : ""}`}
                >
                  {/* Idle State: Subtle Neon Pulse Glow on Hover */}
                  {status === "idle" && isHovering && (
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(123, 97, 255, 0.4), 0 0 40px rgba(0, 255, 231, 0.2)",
                          "0 0 30px rgba(123, 97, 255, 0.6), 0 0 60px rgba(0, 255, 231, 0.3)",
                          "0 0 20px rgba(123, 97, 255, 0.4), 0 0 40px rgba(0, 255, 231, 0.2)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  {/* Button Content with Terminal Flicker */}
                  <motion.span 
                    className="relative z-10 flex items-center gap-2"
                    animate={
                      status === "idle" 
                        ? {
                            opacity: [1, 0.95, 1, 0.98, 1],
                          }
                        : {}
                    }
                    transition={
                      status === "idle"
                        ? {
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear",
                          }
                        : {}
                    }
                  >
                    {status === "sending" ? (
                      <AnimatePresence mode="wait">
                        {uploadPhase === "encrypting" && (
                          <motion.span
                            key="encrypting"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                          >
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              🔐
                            </motion.span>
                            Encrypting message...
                          </motion.span>
                        )}
                        {uploadPhase === "sending" && (
                          <motion.span
                            key="sending"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                          >
                            <motion.span
                              animate={{ y: [-2, 2, -2] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              📡
                            </motion.span>
                            Uploading through hyperspace…
                          </motion.span>
                        )}
                        {uploadPhase === "confirming" && (
                          <motion.span
                            key="confirming"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                          >
                            <motion.span
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                            >
                              ⚡
                            </motion.span>
                            Confirming...
                          </motion.span>
                        )}
                      </AnimatePresence>
                    ) : status === "success" ? (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-xl">✅</span>
                        <span>Transmission Received ✅</span>
                      </motion.span>
                    ) : status === "error" ? (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        <span>Transmission failed — please try again</span>
                      </>
                    ) : isHovering ? (
                      <>
                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                        >
                          🚀
                        </motion.span>
                        <span>Deploy Neural Messenger 🚀</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Initiate Transmission</span>
                      </>
                    )}
                  </motion.span>
                </motion.button>

                {/* Neon Beam Uplink Animation - appears during sending */}
                <AnimatePresence>
                  {status === "sending" && (
                    <>
                      {/* Main Beam */}
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 200, opacity: [0, 1, 0.8] }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute left-1/2 bottom-full -translate-x-1/2 w-1 bg-gradient-to-t from-[#8A2BE2] via-[#00CFFF] to-transparent"
                        style={{
                          boxShadow: "0 0 20px #8A2BE2, 0 0 40px #00CFFF",
                        }}
                      />

                      {/* Rising Particles in Beam */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ y: 0, opacity: 0, x: -2 + Math.random() * 4 }}
                          animate={{
                            y: [-10, -200],
                            opacity: [0, 1, 0],
                            x: -2 + Math.random() * 4,
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeOut",
                          }}
                          className="absolute left-1/2 bottom-full w-1 h-1 rounded-full"
                          style={{
                            background: i % 2 === 0 ? "#8A2BE2" : "#00CFFF",
                            boxShadow: `0 0 8px ${i % 2 === 0 ? "#8A2BE2" : "#00CFFF"}`,
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>

                {/* Success Sparkle Particles */}
                <AnimatePresence>
                  {status === "success" && (
                    <>
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{
                            x: 0,
                            y: 0,
                            opacity: 1,
                            scale: 1,
                          }}
                          animate={{
                            x: (Math.random() - 0.5) * 100,
                            y: (Math.random() - 0.5) * 100,
                            opacity: [1, 0],
                            scale: [1, 0],
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.8,
                            delay: i * 0.05,
                            ease: "easeOut",
                          }}
                          className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full pointer-events-none"
                          style={{
                            background: i % 3 === 0 ? "#8A2BE2" : i % 3 === 1 ? "#00CFFF" : "#fff",
                            boxShadow: `0 0 6px ${i % 3 === 0 ? "#8A2BE2" : i % 3 === 1 ? "#00CFFF" : "#fff"}`,
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>

                {/* Whisper text - Secret system note */}
                {status === "idle" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0.3, 0.4, 0.3], y: 0 }}
                    transition={{
                      opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      y: { duration: 0.6 },
                    }}
                    className="mt-3 text-center"
                  >
                    <p className="text-xs opacity-80 text-gray-600 dark:bg-gradient-to-r dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 dark:bg-clip-text dark:text-transparent dark:drop-shadow-[0_0_6px_rgba(168,85,247,0.35)] italic font-light tracking-wide">
                      *Rumor says the interface shivers when transmission uplinks…*
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Success/Error Messages Below Button */}
              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Your message has been delivered successfully!
                    </span>
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Transmission failed — please try again
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
            </SecureMessageForm>
          </>
        )}
      </div>
    </section>
    </>
  );
}

