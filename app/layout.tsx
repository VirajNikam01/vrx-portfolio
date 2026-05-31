import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppProviders } from "@/providers/app-providers";
import { getSiteUrl, seoConfig } from "@/config/seo";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl("/")),
  applicationName: seoConfig.shortTitle,
  title: {
    default: seoConfig.title,
    template: `%s | ${seoConfig.name}`,
  },
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  authors: [{ name: seoConfig.name, url: getSiteUrl("/") }],
  creator: seoConfig.name,
  publisher: seoConfig.name,
  category: "portfolio",
  alternates: {
    canonical: getSiteUrl("/"),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "profile",
    locale: seoConfig.locale,
    url: getSiteUrl("/"),
    siteName: seoConfig.title,
    title: seoConfig.title,
    description: seoConfig.description,
    firstName: "Viraj",
    lastName: "Nikam",
    images: [
      {
        url: getSiteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "Viraj Nikam software developer portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.title,
    description: seoConfig.description,
    images: [getSiteUrl("/opengraph-image")],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="relative min-h-dvh overflow-x-hidden bg-background text-foreground">
        <AppProviders>
          {children}
        </AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
