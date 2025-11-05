import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import NeonCursor from "@/components/NeonCursor";
import PageTransition from "@/components/PageTransition";
import AIBackdrop from "@/components/AIBackdrop";
import { MagneticEffects } from "@/components/MagneticEffects";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-geist-sans",
  display: "swap"
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
        alt: "Jacob Kuriakose - Portfolio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Jacob Kuriakose - Data Scientist & ML Engineer",
    description: "Portfolio showcasing my work in Machine Learning, NLP, and AI systems",
    images: ["/og-image.jpg"],
    creator: "@jacobkuriakose"
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AIBackdrop />
          <PageTransition />
          <NeonCursor />
          <MagneticEffects />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

