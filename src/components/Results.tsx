"use client";

import { MetricSlope } from "@/components/MetricSlope";
import { StatTile } from "@/components/StatTile";
import { Scroll3DReveal } from "@/components/Scroll3DReveal";
import { SectionNumber } from "@/components/SectionNumber";
import { AnimatedDivider } from "@/components/AnimatedDivider";

/**
 * Every figure here is taken verbatim from the resume. Nothing is estimated,
 * smoothed, or filled in — if a number isn't measured, it isn't plotted.
 */

export default function Results() {
  return (
    <section
      id="results"
      className="py-28 border-b border-foreground/8 relative overflow-clip"
    >
      <SectionNumber number="04" />

      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="mb-16">
          <Scroll3DReveal>
            <span className="editorial-label block mb-4">Results</span>
            <h2 className="font-serif font-medium text-3xl md:text-4xl text-foreground max-w-2xl leading-tight">
              Measured, not claimed.
            </h2>
          </Scroll3DReveal>
        </div>

        <div className="grid lg:grid-cols-12 gap-x-16 gap-y-14">
          {/* Fine-tuning slopes */}
          <div className="lg:col-span-7">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-primary mb-1">
              Granite 4.1 8B — AT&amp;T change risk
            </p>
            <p className="text-sm text-muted-foreground mb-8 max-w-md leading-relaxed">
              Fine-tuned a small language model on synthetic change tickets, judged by
              Claude for explanation correctness and action relevance.
            </p>

            <div className="grid grid-cols-2 gap-x-10 gap-y-4 max-w-lg">
              <MetricSlope
                label="Accuracy"
                unit="% correct"
                before={56.5}
                after={92.3}
                min={40}
                max={100}
                format={(v) => `${v}%`}
                beforeLabel="base"
                afterLabel="tuned"
                deltaText="+35.8 points"
              />
              <MetricSlope
                label="Macro F1"
                unit="0 – 1"
                before={0.5}
                after={0.92}
                min={0.3}
                max={1}
                format={(v) => v.toFixed(2)}
                beforeLabel="base"
                afterLabel="tuned"
                deltaText="+0.42"
                delay={0.12}
              />
            </div>
          </div>

          {/* Single-number results */}
          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-primary mb-1">
              Shipped systems
            </p>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm leading-relaxed">
              Production outcomes from the Waterbot platform, the synthetic data
              pipeline, and retail demand forecasting.
            </p>

            <div className="grid grid-cols-2 gap-x-10 gap-y-8">
              <StatTile
                value="~85%"
                label="Faster releases"
                context="ECS CLI redeploys over full-stack deploys"
              />
              <StatTile
                value="2,000+"
                label="Users served"
                context="Waterbot RAG chatbot at azwaterbot.org"
                delay={0.06}
              />
              <StatTile
                value="50K"
                label="Tickets generated"
                context="Synthetic change-management training data"
                delay={0.12}
              />
              <StatTile
                value="38.9%"
                label="RMSE improvement"
                context="Exponential Smoothing over LSTM"
                delay={0.18}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatedDivider />
    </section>
  );
}
