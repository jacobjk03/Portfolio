"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { resumeData } from "@/config/resume-data";

/**
 * "Beat the forecast" — draw where you think the series goes, then see how you
 * did against an actual forecasting model.
 *
 * ON THE DATA: the series is synthetic and labelled as such in the UI. It's
 * generated from a seeded seasonal process, not taken from the Walmart project,
 * because dressing up invented numbers as real project data would be a lie.
 *
 * The model, however, is real: Holt's linear exponential smoothing, fitted live
 * on the visible history — the same family of model that beat LSTM by 38.92%
 * RMSE on the actual project. Both scores are honest RMSE against the held-out
 * truth, so losing to it means something.
 */

const DAYS = 30;
const SPLIT = 20;              // days visible before the forecast horizon
const HORIZON = DAYS - SPLIT;

const W = 560;
const H = 260;
const PAD_L = 42;
const PAD_R = 16;
const PAD_T = 18;
const PAD_B = 34;

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Weekly seasonal period — retail demand's natural cycle. */
const SEASON = 7;

/** Seasonal series with mild trend and noise. Deterministic per seed. */
function makeSeries(seed: number) {
  const rand = mulberry32(seed);
  const base = 198 + rand() * 10;
  const amp = 12 + rand() * 8;
  const drift = (rand() - 0.45) * 0.5;
  const phase = rand() * Math.PI * 2;

  return Array.from({ length: DAYS }, (_, d) => {
    const seasonal = Math.sin((d / SEASON) * Math.PI * 2 + phase) * amp;
    // Noise is deliberately generous. With a quieter series Holt-Winters lands
    // at the noise floor (~2.2 RMSE) and no human could ever win, which makes
    // for a dead game. At this level the model averages ~5.5 and a careful
    // hand-drawn line is genuinely competitive.
    const noise = (rand() - 0.5) * 14;
    return base + seasonal + drift * d + noise;
  });
}

/**
 * Holt-Winters additive exponential smoothing — level, trend AND seasonality.
 *
 * The plain (non-seasonal) Holt method extrapolates a straight line, which on a
 * weekly-seasonal series loses to almost any hand-drawn guess. That would have
 * made the game misrepresent how the model class actually performs, so this
 * fits the seasonal component too — the same family that beat LSTM by 38.92%
 * RMSE on the real Walmart project.
 */
function holtWinters(
  history: number[],
  h: number,
  m = SEASON,
  alpha = 0.35,
  beta = 0.08,
  gamma = 0.35
) {
  const periods = Math.floor(history.length / m);
  if (periods < 2) {
    // Not enough history to estimate seasonality — fall back to level + trend.
    let level = history[0];
    let trend = history[1] - history[0];
    for (let i = 1; i < history.length; i++) {
      const prev = level;
      level = alpha * history[i] + (1 - alpha) * (level + trend);
      trend = beta * (level - prev) + (1 - beta) * trend;
    }
    return Array.from({ length: h }, (_, k) => level + (k + 1) * trend);
  }

  // Seed level/trend/seasonals from the first two whole periods.
  const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
  const p1 = mean(history.slice(0, m));
  const p2 = mean(history.slice(m, 2 * m));
  let level = p1;
  let trend = (p2 - p1) / m;
  const seasonal: number[] = [];
  for (let i = 0; i < m; i++) {
    const vals: number[] = [];
    for (let p = 0; p < periods; p++) vals.push(history[p * m + i]);
    seasonal.push(mean(vals) - p1);
  }

  for (let i = 0; i < history.length; i++) {
    const s = seasonal[i % m];
    const prevLevel = level;
    level = alpha * (history[i] - s) + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
    seasonal[i % m] = gamma * (history[i] - level) + (1 - gamma) * s;
  }

  return Array.from(
    { length: h },
    (_, k) => level + (k + 1) * trend + seasonal[(history.length + k) % m]
  );
}

function rmse(a: number[], b: number[]) {
  const n = Math.min(a.length, b.length);
  let s = 0;
  for (let i = 0; i < n; i++) s += (a[i] - b[i]) ** 2;
  return Math.sqrt(s / n);
}

export function ForecastGame({ onOpenProject }: { onOpenProject?: () => void }) {
  const [seed, setSeed] = useState(4242);
  const [guess, setGuess] = useState<(number | null)[]>(Array(HORIZON).fill(null));
  const [revealed, setRevealed] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [touched, setTouched] = useState(false);   // has the visitor interacted?
  const svgRef = useRef<SVGSVGElement>(null);

  // Ties the game to the project it came out of. Matched by title so it can't
  // drift from the card sitting next to it in the grid.
  const project = resumeData.projects.find((p) => /walmart/i.test(p.title));

  const series = useMemo(() => makeSeries(seed), [seed]);
  const history = useMemo(() => series.slice(0, SPLIT), [series]);
  const truth = useMemo(() => series.slice(SPLIT), [series]);
  const model = useMemo(() => holtWinters(history, HORIZON), [history]);

  const domain = useMemo(() => {
    const all = [...series, ...model];
    const lo = Math.min(...all) - 8;
    const hi = Math.max(...all) + 8;
    return { lo, hi };
  }, [series, model]);

  const x = useCallback(
    (d: number) => PAD_L + (d / (DAYS - 1)) * (W - PAD_L - PAD_R),
    []
  );
  const y = useCallback(
    (v: number) =>
      PAD_T + (1 - (v - domain.lo) / (domain.hi - domain.lo)) * (H - PAD_T - PAD_B),
    [domain]
  );
  const yInv = useCallback(
    (py: number) =>
      domain.lo + (1 - (py - PAD_T) / (H - PAD_T - PAD_B)) * (domain.hi - domain.lo),
    [domain]
  );

  const complete = guess.every((g) => g !== null);

  const paint = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const px = ((clientX - rect.left) / rect.width) * W;
      const py = ((clientY - rect.top) / rect.height) * H;

      const d = Math.round(((px - PAD_L) / (W - PAD_L - PAD_R)) * (DAYS - 1));
      const idx = d - SPLIT;
      if (idx < 0 || idx >= HORIZON) return;

      const v = Math.max(domain.lo, Math.min(domain.hi, yInv(py)));
      setGuess((prev) => {
        const next = [...prev];
        next[idx] = v;
        // Fill any days skipped by a fast drag so the line stays continuous.
        for (let i = 0; i < HORIZON; i++) {
          if (next[i] === null) continue;
          for (let j = i + 1; j < HORIZON; j++) {
            if (next[j] === null) continue;
            const gap = j - i;
            if (gap > 1) {
              for (let k = 1; k < gap; k++) {
                next[i + k] = next[i]! + ((next[j]! - next[i]!) * k) / gap;
              }
            }
            break;
          }
        }
        return next;
      });
    },
    [domain, yInv]
  );

  const reset = (newSeed?: number) => {
    setGuess(Array(HORIZON).fill(null));
    setRevealed(false);
    if (newSeed !== undefined) setSeed(newSeed);
  };

  const line = (vals: number[], from = 0) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"} ${x(from + i)} ${y(v)}`).join(" ");

  const guessLine = () => {
    const pts: string[] = [];
    guess.forEach((g, i) => {
      if (g === null) return;
      pts.push(`${pts.length === 0 ? "M" : "L"} ${x(SPLIT + i)} ${y(g)}`);
    });
    return pts.join(" ");
  };

  const userScore = complete ? rmse(guess as number[], truth) : null;
  const modelScore = rmse(model, truth);
  const userWins = userScore !== null && userScore < modelScore;

  return (
    <div className="bg-background p-6 md:p-8 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-primary">
            Interactive
          </p>
          <h3 className="font-serif font-medium text-xl text-foreground mt-1">
            Beat the forecast.
          </h3>
        </div>
        <p className="font-mono text-[10px] text-foreground/35 shrink-0 pt-1">
          Holt-Winters ES
        </p>
      </div>

      {project && (
        <p className="text-[11px] text-muted-foreground mb-3">
          the model from{" "}
          <button
            onClick={onOpenProject}
            className="text-foreground/80 hover:text-primary underline underline-offset-2 decoration-foreground/25 hover:decoration-primary transition-colors inline-flex items-center gap-0.5"
          >
            {project.title}
            <ArrowUpRight className="w-3 h-3" />
          </button>
          {" "}and try to beat it
        </p>
      )}

      <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-md">
        Drag across the shaded area to draw where you think demand goes next.
        Then see how your line scores against the model.
      </p>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        style={{ touchAction: "none", cursor: revealed ? "default" : "crosshair" }}
        onPointerDown={(e) => {
          if (revealed) return;
          setDrawing(true);
          setTouched(true);
          (e.target as Element).setPointerCapture?.(e.pointerId);
          paint(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (!drawing || revealed) return;
          paint(e.clientX, e.clientY);
        }}
        onPointerUp={() => setDrawing(false)}
        onPointerLeave={() => setDrawing(false)}
      >
        {/* Forecast region — breathes gently until the visitor engages */}
        <rect
          x={x(SPLIT)} y={PAD_T}
          width={x(DAYS - 1) - x(SPLIT)} height={H - PAD_T - PAD_B}
          fill="hsl(var(--primary))"
          className={touched ? undefined : "draw-region-idle"}
          opacity={touched ? 0.045 : undefined}
        />
        {/* Dashed outline reads as "this area is for you" */}
        <rect
          x={x(SPLIT)} y={PAD_T}
          width={x(DAYS - 1) - x(SPLIT)} height={H - PAD_T - PAD_B}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={touched ? 0.18 : 0.4}
          className="transition-opacity duration-500"
        />
        <line
          x1={x(SPLIT)} y1={PAD_T} x2={x(SPLIT)} y2={H - PAD_B}
          stroke="hsl(var(--data-grid))" strokeDasharray="3 3"
        />

        {/* Axis */}
        <line
          x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B}
          stroke="hsl(var(--data-grid))"
        />

        {/* History */}
        <path
          d={line(history)}
          fill="none"
          stroke="hsl(var(--data-2))"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* The visitor's line */}
        {guess.some((g) => g !== null) && (
          <path
            d={guessLine()}
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth={2}
            strokeDasharray="5 4"
            strokeLinecap="round"
            opacity={0.75}
          />
        )}

        {revealed && (
          <>
            {/* Truth continues from the last known point */}
            <path
              d={line([history[history.length - 1], ...truth], SPLIT - 1)}
              fill="none"
              stroke="hsl(var(--data-2))"
              strokeWidth={2}
              strokeLinecap="round"
            />
            {/* Model forecast */}
            <path
              d={line([history[history.length - 1], ...model], SPLIT - 1)}
              fill="none"
              stroke="hsl(var(--data-1))"
              strokeWidth={2}
              strokeDasharray="6 3"
              strokeLinecap="round"
            />
          </>
        )}

        {!touched && !revealed && (
          <>
            {/* Ghost cursor sweeping the region — shows the gesture. It stays at
                a constant height on purpose so it never suggests an answer. */}
            <g
              className="draw-hint"
              style={{ ["--hint-dist" as string]: `${x(DAYS - 1) - x(SPLIT) - 14}px` }}
            >
              <line
                x1={x(SPLIT) + 6} y1={PAD_T + 68}
                x2={x(SPLIT) + 30} y2={PAD_T + 68}
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray="4 4"
                opacity={0.35}
              />
              <circle
                cx={x(SPLIT) + 30} cy={PAD_T + 68} r={4.5}
                fill="hsl(var(--primary))"
              />
              <circle
                cx={x(SPLIT) + 30} cy={PAD_T + 68} r={9}
                fill="none" stroke="hsl(var(--primary))" strokeWidth={1} opacity={0.4}
              />
            </g>
            <text
              x={(x(SPLIT) + x(DAYS - 1)) / 2}
              y={PAD_T + 24}
              textAnchor="middle"
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                fill: "hsl(var(--primary))",
                opacity: 0.85,
                fontWeight: 500,
              }}
            >
              drag to draw
            </text>
          </>
        )}

        <text
          x={PAD_L} y={H - 10}
          className="font-mono"
          style={{ fontSize: 9, fill: "currentColor", opacity: 0.35 }}
        >
          day 1
        </text>
        <text
          x={W - PAD_R} y={H - 10} textAnchor="end"
          className="font-mono"
          style={{ fontSize: 9, fill: "currentColor", opacity: 0.35 }}
        >
          day {DAYS}
        </text>
      </svg>

      {/* Scores */}
      <div className="mt-4 min-h-[72px]">
        {revealed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="inline-block w-4 h-0 border-t-2 border-dashed border-foreground/60" />
                Your line
              </span>
              <span className="font-mono text-foreground">
                RMSE {userScore!.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="inline-block w-4 h-0 border-t-2 border-dashed"
                  style={{ borderColor: "hsl(var(--data-1))" }}
                />
                Exponential smoothing
              </span>
              <span className="font-mono" style={{ color: "hsl(var(--data-1))" }}>
                RMSE {modelScore.toFixed(2)}
              </span>
            </div>
            <p className="text-[12px] pt-1 text-foreground">
              {userWins
                ? "You beat it. Most people do not."
                : "The model wins this round. Lower RMSE is better."}
            </p>
          </div>
        ) : (
          <p className="text-[11px] text-foreground/40 font-mono">
            {complete
              ? "line complete, hit reveal"
              : `${guess.filter((g) => g !== null).length}/${HORIZON} days drawn`}
          </p>
        )}
      </div>

      <div className="flex gap-3 mt-4 flex-wrap">
        <button
          onClick={() => setRevealed(true)}
          disabled={!complete || revealed}
          className="px-5 py-2.5 bg-primary text-white text-[10px] font-semibold tracking-[0.14em] uppercase disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        >
          Reveal
        </button>
        <button
          onClick={() => reset()}
          className="btn-fill px-5 py-2.5 border border-foreground/20 text-[10px] font-semibold tracking-[0.14em] uppercase"
        >
          Clear
        </button>
        <button
          onClick={() => reset(Math.floor(Math.random() * 100000))}
          className="px-5 py-2.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-primary hover:underline underline-offset-4"
        >
          New series →
        </button>
      </div>

      <p className="text-[10px] text-foreground/30 mt-4 leading-snug">
        Synthetic weekly-seasonal series, not project data. The model is real:
        Holt-Winters exponential smoothing, fitted live on the visible history.
      </p>
    </div>
  );
}
