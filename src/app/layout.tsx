import type { Metadata, Viewport } from "next";
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

const SITE_URL = "https://jacobkuriakose.com";

const DESCRIPTION =
  "Jacob Kuriakose is a Data Scientist and Platform Engineer at Wipro in Plano, TX, working on NLP, time series forecasting and multi-agent AI systems. Fine-tuned a Granite 4.1 8B model from 56.5% to 92.3% accuracy and built a production RAG chatbot serving 2,000+ users on AWS.";

export const metadata: Metadata = {
  // Without metadataBase, Next cannot turn the relative OG image path into an
  // absolute URL, and every crawler that reads it gets a broken reference.
  metadataBase: new URL(SITE_URL),
  title: "Jacob Kuriakose - Data Scientist & Machine Learning Engineer",
  description: DESCRIPTION,
  keywords: [
    "Data Scientist", "Machine Learning Engineer", "NLP", "LLM Fine-Tuning",
    "RAG", "Multi-Agent Systems", "Time Series Forecasting", "AWS", "Python",
    "PyTorch", "LangChain", "Portfolio", "Jacob Kuriakose",
  ],
  authors: [{ name: "Jacob Kuriakose", url: SITE_URL }],
  creator: "Jacob Kuriakose",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Jacob Kuriakose - Data Scientist & ML Engineer",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Jacob Kuriakose",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jacob Kuriakose - Data Scientist & ML Engineer",
    description: DESCRIPTION,
  },
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

// viewport and themeColor moved out of `metadata`: Next 14 deprecated them
// there and warned about it on every build.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#1C1917" },
  ],
};

/**
 * Structured data. Gives search engines and AI crawlers a machine-readable
 * description of who this is, rather than leaving them to infer it from markup.
 */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jacob Kuriakose",
  url: SITE_URL,
  jobTitle: "Platform Engineer",
  worksFor: { "@type": "Organization", name: "Wipro" },
  address: { "@type": "PostalPlace", addressLocality: "Plano", addressRegion: "TX", addressCountry: "US" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Arizona State University" },
    { "@type": "CollegeOrUniversity", name: "Dr. Akhilesh Das Gupta Institute of Technology and Management" },
  ],
  knowsAbout: [
    "Natural Language Processing", "Large Language Model Fine-Tuning",
    "Retrieval-Augmented Generation", "Multi-Agent Systems",
    "Time Series Forecasting", "Amazon Web Services", "Machine Learning",
  ],
  sameAs: [
    "https://github.com/jacobjk03",
    "https://linkedin.com/in/jacob-kuriakose",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* apple-touch-icon.png and manifest.json don't exist in /public, so the
            links were 404ing on every page load and are omitted. */}
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
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
