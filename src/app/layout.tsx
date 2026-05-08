import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/providers";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mealio.ai — Personalized Weekly Meal Planner",
    template: "%s | Mealio.ai",
  },
  description:
    "Mealio.ai helps you plan, organize and track your weekly meals with personalized plans built around your goals, nutrition needs and lifestyle.",
  keywords: [
    "meal planner",
    "weekly meal plan",
    "nutrition tracker",
    "calorie tracker",
    "healthy eating",
    "meal prep",
    "diet planner",
    "macro tracker",
    "AI meal planner",
  ],
  authors: [{ name: "Mealio.ai" }],
  creator: "Mealio.ai",
  metadataBase: new URL("https://mealio.ai"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mealio.ai",
    siteName: "Mealio.ai",
    title: "Mealio.ai — Personalized Weekly Meal Planner",
    description:
      "Plan smarter, eat better. Create personalized weekly meal plans based on your goals, preferences and lifestyle.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mealio.ai — Personalized Weekly Meal Planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mealio.ai — Personalized Weekly Meal Planner",
    description:
      "Plan smarter, eat better. Create personalized weekly meal plans based on your goals, preferences and lifestyle.",
    images: ["/og-image.png"],
    creator: "@mealioai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", figtree.variable)}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
