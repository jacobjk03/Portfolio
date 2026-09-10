import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import PageTransition from "@/components/PageTransition";
import { MagneticEffects } from "@/components/MagneticEffects";
import { AIAssistant } from "@/components/AIAssistant";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

// Display serif. Fraunces is a variable face with optical sizing and a "wonk"
// axis — it carries real personality at hero scale while staying readable small.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});

// Used for metrics, data labels and the reasoning trace — technical texture.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Jacob Kuriakose - Data Scientist & Machine Learning Engineer",
  description: "Data Scientist specializing in Machine Learning and NLP with hands-on experience in deploying generative AI systems and cloud-native architectures. Strong background in agentic LLM pipelines, time-series forecasting, and scalable ML infrastructure on AWS.",
  keywords: ["Data Scientist", "Machine Learning", "NLP", "AI", "AWS", "Python", "LLM", "Deep Learning", "Portfolio", "Jacob Kuriakose"],
  authors: [{ name: "Jacob Kuriakose" }],
  creator: "Jacob Kuriakose",
  openGraph: {
    title: "Jacob Kuriakose - Data Scientist & ML Engineer",
    description: "Portfolio showcasing my work in Machine Learning, NLP, and AI systems",
    url: "https://jacobkuriakose.com",
    siteName: "Jacob Kuriakose Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jacob Kuriakose - Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jacob Kuriakose - Data Scientist & ML Engineer",
    description: "Portfolio showcasing my work in Machine Learning, NLP, and AI systems",
    images: ["/og-image.jpg"],
    creator: "@jacobkuriakose",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F7F4" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* apple-touch-icon.png and manifest.json don't exist in /public — the
            links were 404ing on every page load, so they're omitted. */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider>
          <PageTransition />
          <MagneticEffects />
          {children}
          <AIAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
