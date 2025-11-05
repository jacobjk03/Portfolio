"use client";

import type React from "react";
import { Globe, Flag } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const faqData = [
  {
    question: "Work eligibility?",
    answer: "CPT for internship + 3 years STEM-OPT full-time after graduation"
  },
  {
    question: "Visa type",
    answer: "F-1 STEM Master's"
  },
  {
    question: "Degree",
    answer: "MS in Data Science (currently enrolled full-time)"
  },
  {
    question: "Need sponsorship now?",
    answer: "No"
  },
  {
    question: "Need sponsorship later?",
    answer: "Yes, after STEM-OPT"
  },
  {
    question: "Graduation",
    answer: "May 2026"
  },
  {
    question: "Open to relocation?",
    answer: "Yes"
  },
  {
    question: "Looking for",
    answer: "AI/ML Engineer, Software Engineer, Applied AI"
  }
];

export default function WorkAuthorizationFAQ() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1, rootMargin: "-100px", triggerOnce: true });

  return (
    <section id="work-authorization" className="py-20 bg-secondary/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flag className="w-8 h-8 text-purple-500" />
            <Globe className="w-8 h-8 text-cyan-500" />
            <h2 className="text-4xl md:text-5xl font-bold">Work Authorization & Hiring FAQ</h2>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full" />
        </div>

        <div
          className={`max-w-4xl mx-auto transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="rounded-2xl border border-purple-500/20 bg-background/50 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-b border-purple-500/20">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Question</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {faqData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{item.question}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{item.answer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

