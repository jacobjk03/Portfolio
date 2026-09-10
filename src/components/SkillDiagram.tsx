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

/**
 * NLP: three lines of "text" as uneven word blocks. Two rows of abstract bars
 * read as a chart; a ragged paragraph reads as language.
 */
const NLP_LINES: [number, number, number][] = [
  [22, 24, 44], [72, 24, 26], [104, 24, 56],
  [22, 43, 32], [60, 43, 60], [126, 43, 34],
  [22, 62, 50], [78, 62, 38], [122, 62, 22],
];

/** The phrase the highlighter lands on (padded around word 2 of line 2). */
const NLP_HIGHLIGHT = { x: 56, y: 38, w: 68, h: 15 };

/** Data points for the fine-tuning scatter, sitting on a gentle arc. */
const FT_POINTS: [number, number][] = [
  [30, 66], [58, 52], [86, 44], [114, 42], [142, 47], [170, 58],
];

/** Where the naive flat fit sits — the line the error bars measure against. */
const FT_FLAT_Y = 52;

/** RAG: three documents on the right, each drawn as a page with text lines. */
const RAG_DOCS: number[] = [10, 37, 64];

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
        // Training: error bars from each point to a flat naive fit collapse to
        // nothing as the curve learns the shape. Watching the error shrink
        // reads as learning; a line quietly swapping for a curve did not.
        <g>
          {/* Naive flat fit — the thing being improved on */}
          <line
            x1={24} y1={FT_FLAT_Y} x2={176} y2={FT_FLAT_Y}
            stroke="hsl(var(--data-2))" strokeWidth={1.5} strokeDasharray="4 4"
            className="sd-ft-naive"
          />

          {/* Residuals: one per point, scaling to zero as the fit improves */}
          {FT_POINTS.map(([x, y], i) => (
            <line
              key={`e-${x}`}
              x1={x} y1={y} x2={x} y2={FT_FLAT_Y}
              stroke="hsl(var(--data-2))" strokeWidth={1.5}
              className="sd-ft-err"
              style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * 0.05}s` }}
            />
          ))}

          {/* The learned fit */}
          <path
            d="M 30 66 Q 100 22 170 58"
            fill="none" stroke="hsl(var(--data-1))" strokeWidth={2} strokeLinecap="round"
            className="sd-ft-fit"
          />

          {FT_POINTS.map(([x, y]) => (
            <circle
              key={`p-${x}`}
              cx={x} cy={y} r={3.4}
              fill="hsl(var(--foreground))" opacity={0.5}
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
        // Question goes out, the matching source lights up, the answer comes
        // back and fills. Empty rectangles didn't say "documents", and nothing
        // ever returned — which is the entire point of retrieval-augmented.
        <g>
          {/* Path between the answer card and the corpus */}
          <line
            x1={64} y1={48} x2={132} y2={48}
            stroke="hsl(var(--data-grid))" strokeWidth={1} strokeDasharray="2 3"
          />

          {/* Answer card, left */}
          <rect
            x={16} y={34} width={46} height={28} rx={1}
            fill="none" stroke="hsl(var(--foreground))" strokeWidth={1.2} opacity={0.3}
          />
          {[42, 50].map((y, i) => (
            <rect
              key={`a-${y}`}
              x={22} y={y} width={i === 0 ? 34 : 24} height={3.5} rx={1.5}
              fill="hsl(var(--data-1))"
              className="sd-rag-answer"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}

          {/* Corpus, right — pages with text lines */}
          {RAG_DOCS.map((y, i) => (
            <g key={`d-${y}`} className={i === 1 ? "sd-rag-hit" : undefined}>
              <rect
                x={138} y={y} width={44} height={22} rx={1}
                fill="hsl(var(--background))"
                stroke={i === 1 ? "hsl(var(--data-1))" : "hsl(var(--foreground))"}
                strokeWidth={1.2}
                opacity={i === 1 ? 1 : 0.28}
              />
              {[y + 7, y + 13].map((ly, k) => (
                <rect
                  key={ly}
                  x={144} y={ly} width={k === 0 ? 32 : 22} height={2.5} rx={1.2}
                  fill={i === 1 ? "hsl(var(--data-1))" : "hsl(var(--foreground))"}
                  opacity={i === 1 ? 0.75 : 0.25}
                />
              ))}
            </g>
          ))}

          {/* Query travelling out, answer travelling back */}
          <circle r={3.8} fill="hsl(var(--data-2))" className="sd-rag-query" />
          <circle r={3.8} fill="hsl(var(--data-1))" className="sd-rag-return" />
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
        // A paragraph with a highlighter sweeping onto the phrase that matters.
        // Everyone recognises highlighting text; abstract blocks lighting up
        // read as a bar chart.
        <g>
          {/* Highlight sits UNDER the words so the text stays readable */}
          <rect
            x={NLP_HIGHLIGHT.x} y={NLP_HIGHLIGHT.y}
            width={NLP_HIGHLIGHT.w} height={NLP_HIGHLIGHT.h} rx={2}
            fill="hsl(var(--data-1))"
            className="sd-nlp-mark"
            style={{ transformOrigin: `${NLP_HIGHLIGHT.x}px ${NLP_HIGHLIGHT.y}px` }}
          />

          {NLP_LINES.map(([x, y, w], i) => {
            // The two words inside the highlight darken as it lands on them.
            const marked = i === 4;
            return (
              <rect
                key={`w-${x}-${y}`}
                x={x} y={y} width={w} height={8} rx={1.5}
                fill="hsl(var(--foreground))"
                opacity={marked ? 0.5 : 0.2}
                className={marked ? "sd-nlp-word" : undefined}
              />
            );
          })}
        </g>
      )}

      {kind === "cloud" && (
        // A deployment, not a cloud icon: the service ships along the track and
        // comes up running in the cloud. Every other diagram here shows a
        // mechanism; a cloud with boxes drifting near it was the only one that
        // was just scenery, and it said nothing about shipping.
        <g>
          {/* Source service, left */}
          <rect
            x={20} y={36} width={24} height={24} rx={2}
            fill="none" stroke="hsl(var(--foreground))" strokeWidth={1.5} opacity={0.35}
          />
          <rect
            x={26} y={43} width={12} height={3} rx={1.5}
            fill="hsl(var(--foreground))" opacity={0.3}
          />
          <rect
            x={26} y={50} width={8} height={3} rx={1.5}
            fill="hsl(var(--foreground))" opacity={0.3}
          />

          {/* Track */}
          <line
            x1={50} y1={48} x2={112} y2={48}
            stroke="hsl(var(--data-grid))" strokeWidth={1} strokeDasharray="3 3"
          />

          {/* The shipping unit */}
          <rect
            width={10} height={10} rx={1.5}
            fill="hsl(var(--data-1))"
            className="sd-aws-ship"
          />

          {/* Cloud, right */}
          <g fill="hsl(var(--data-2))" opacity={0.22}>
            <circle cx={132} cy={40} r={13} />
            <circle cx={151} cy={33} r={17} />
            <circle cx={168} cy={41} r={12} />
            <rect x={120} y={39} width={60} height={15} rx={7.5} />
          </g>

          {/* Running instances inside the cloud */}
          {[133, 146, 159].map((x, i) => (
            <rect
              key={x}
              x={x} y={36} width={9} height={9} rx={1.5}
              fill="hsl(var(--data-1))"
              className="sd-cloud-box"
              style={{ animationDelay: `${i * 0.14}s` }}
            />
          ))}
        </g>
      )}
    </svg>
  );
}
