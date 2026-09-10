import { ImageResponse } from "next/og";

/**
 * Link preview card, generated at build time.
 *
 * The metadata used to point at /og-image.jpg, which does not exist in /public,
 * so every share on LinkedIn, Slack or iMessage rendered a broken reference.
 * Generating it here means it can never drift out of sync with the site again.
 *
 * System fonts only: pulling Fraunces in would mean fetching the file at build
 * time, and a preview card is not worth that failure mode.
 */

export const alt = "Jacob Kuriakose, Data Scientist and Machine Learning Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#FAFAF7";
const INK = "#1C1917";
const COPPER = "#B84D27";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CREAM,
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: COPPER,
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
            }}
          >
            Data Scientist &amp; ML Engineer
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 20,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(28,25,23,0.45)",
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            <div style={{ width: 10, height: 10, background: "#16A34A", borderRadius: 9999 }} />
            Open to opportunities
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 116, color: INK, lineHeight: 1, letterSpacing: "-0.02em" }}>
            Jacob Kuriakose
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 32,
              color: "rgba(28,25,23,0.6)",
              lineHeight: 1.35,
              maxWidth: 900,
              fontStyle: "italic",
            }}
          >
            NLP, time series forecasting and multi-agent AI systems, shipped on the cloud.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ width: 96, height: 4, background: COPPER }} />
          {[
            "56.5% to 92.3% accuracy",
            "2,000+ users served",
            "38.9% RMSE improvement",
          ].map((stat) => (
            <div
              key={stat}
              style={{
                fontSize: 21,
                color: "rgba(28,25,23,0.55)",
                fontFamily: "Helvetica, Arial, sans-serif",
              }}
            >
              {stat}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
