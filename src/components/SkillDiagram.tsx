"use client";

/**
 * Tiny looping diagrams — one per headline skill.
 *
 * The Skills section previously read as a list of nouns, which a visitor
 * skimming for ten seconds will not read. Numbers were the obvious fix, but the
 * Results section already owns numbers; repeating them here would just make two
 * scoreboards. So each skill gets a small animation of the *mechanism* instead:
 * something a non-technical viewer understands at a glance without reading.
 *
 * All motion is CSS keyframes (see globals.css) so nothing runs on the main
 * thread, and everything stops under prefers-reduced-motion.
 */

export type DiagramKind =
  | "finetune"
  | "forecast"
  | "rag"
  | "agents"
  | "nlp"
  | "cloud";

const W = 200;
const H = 96;

/** Word blocks for the NLP diagram: [x, y, width] — uneven, on two lines. */
const WORDS: [number, number, number][] = [
  [30, 36, 26], [62, 36, 16], [84, 36, 34], [124, 36, 20], [150, 36, 24],
  [30, 54, 18], [54, 54, 30], [90, 54, 22], [118, 54, 36],
];

export function SkillDiagram({ kind, active }: { kind: DiagramKind; active: boolean }) {
  const cls = active ? "sd-run" : "";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`h-full w-auto ${cls}`}
      aria-hidden="true"
      focusable="false"
    >
      {kind === "finetune" && (
        // Learning the pattern: a naive straight fit gives way to a curve that
        // actually follows the data. The dots stay put — the MODEL changes,
        // which is the whole idea of fine-tuning.
        <g fill="none" strokeWidth={2} strokeLinecap="round">
          <path
            d="M 30 66 L 170 58"
            stroke="hsl(var(--data-2))"
            strokeDasharray="4 4"
            className="sd-ft-naive"
          />
          <path
            d="M 30 66 Q 100 22 170 58"
            stroke="hsl(var(--data-1))"
            className="sd-ft-fit"
          />
          {[
            [30, 66], [58, 52], [86, 44], [114, 42], [142, 47], [170, 58],
          ].map(([x, y]) => (
            <circle
              key={`${x}-${y}`}
              cx={x} cy={y} r={3.2}
              fill="hsl(var(--foreground))"
              stroke="none"
              opacity={0.45}
            />
          ))}
        </g>
      )}

      {kind === "forecast" && (
        // History draws, then the forecast continues as a dashed extension.
        <g fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M 16 70 L 38 52 L 60 62 L 82 34 L 104 48"
            stroke="hsl(var(--data-2))"
            className="sd-fc-hist"
          />
          <path
            d="M 104 48 L 126 30 L 148 44 L 170 26 L 186 36"
            stroke="hsl(var(--data-1))"
            strokeDasharray="5 4"
            className="sd-fc-fut"
          />
          <line x1={104} y1={16} x2={104} y2={80} stroke="hsl(var(--data-grid))" strokeWidth={1} />
        </g>
      )}

      {kind === "rag" && (
        // A question travels to the corpus, finds a match, and returns grounded.
        <g>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={132} y={26 + i * 20} width={40} height={14} rx={1}
              fill="none" stroke="hsl(var(--foreground))" strokeWidth={1}
              opacity={0.28}
              className={i === 1 ? "sd-rag-hit" : undefined}
            />
          ))}
          <circle cx={0} cy={0} r={4} fill="hsl(var(--data-1))" className="sd-rag-query" />
          <line
            x1={28} y1={48} x2={126} y2={48}
            stroke="hsl(var(--data-grid))" strokeWidth={1} strokeDasharray="2 3"
          />
        </g>
      )}

      {kind === "agents" && (
        // One router lighting up three specialised handlers in turn.
        <g>
          <line x1={44} y1={48} x2={150} y2={22} stroke="hsl(var(--data-grid))" strokeWidth={1} />
          <line x1={44} y1={48} x2={150} y2={48} stroke="hsl(var(--data-grid))" strokeWidth={1} />
          <line x1={44} y1={48} x2={150} y2={74} stroke="hsl(var(--data-grid))" strokeWidth={1} />
          <circle cx={44} cy={48} r={7} fill="hsl(var(--data-1))" />
          {[22, 48, 74].map((y, i) => (
            <circle
              key={y}
              cx={150} cy={y} r={5.5}
              fill="hsl(var(--data-2))"
              className="sd-agent-node"
              style={{ animationDelay: `${i * 0.7}s` }}
            />
          ))}
        </g>
      )}

      {kind === "nlp" && (
        // Reading a sentence: words sit on two lines and the meaningful ones
        // light up in turn. A bar splitting into equal blocks didn't say
        // "language" — words of uneven length on a baseline do.
        <g>
          {WORDS.map(([x, y, w]) => (
            <rect
              key={`b-${x}-${y}`}
              x={x} y={y} width={w} height={9} rx={1.5}
              fill="hsl(var(--foreground))" opacity={0.17}
            />
          ))}
          {/* The ones that get "understood" */}
          {[1, 3, 5].map((idx, i) => {
            const [x, y, w] = WORDS[idx];
            return (
              <rect
                key={`h-${idx}`}
                x={x} y={y} width={w} height={9} rx={1.5}
                fill="hsl(var(--data-1))"
                className="sd-nlp-tok"
                style={{ animationDelay: `${i * 0.45}s` }}
              />
            );
          })}
        </g>
      )}

      {kind === "cloud" && (
        // An actual cloud with services deploying up into it. Boxes on a
        // baseline read as "bar chart", not "cloud" — the silhouette is the one
        // shape everybody recognises instantly.
        <g>
          <g fill="hsl(var(--data-2))" opacity={0.2}>
            <circle cx={82} cy={38} r={15} />
            <circle cx={103} cy={31} r={19} />
            <circle cx={122} cy={39} r={13} />
            <rect x={68} y={37} width={68} height={17} rx={8.5} />
          </g>
          {[86, 102, 118].map((x, i) => (
            <rect
              key={x}
              x={x} y={62} width={12} height={12} rx={1.5}
              fill="hsl(var(--data-1))"
              className="sd-cloud-box"
              style={{ animationDelay: `${i * 0.28}s` }}
            />
          ))}
        </g>
      )}
    </svg>
  );
}
