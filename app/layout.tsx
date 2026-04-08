import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.deanlennard.com"),
  title: "Dean Lennard | Full-Stack Developer UK",
  description:
    "Freelance full-stack developer in the UK building scalable web applications with performance, SEO, and delivery focus.",
  openGraph: {
    siteName: "Dean Lennard",
    type: "website",
    url: "https://www.deanlennard.com",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZDVRLE5YF0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZDVRLE5YF0');
          `}
        </Script>
      </head>
      <body className="min-h-full bg-background text-foreground">
        <div className="relative flex min-h-full flex-col overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,_rgba(31,41,55,1)_0%,_rgba(17,24,39,1)_100%)]" />
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
