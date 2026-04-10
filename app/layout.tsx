import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { Analytics } from "@/components/analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  GA_MEASUREMENT_ID,
  POSTHOG_HOST,
  POSTHOG_PROJECT_TOKEN,
  isAnalyticsEnabled,
  isPostHogEnabled,
} from "@/lib/analytics";

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
        {isAnalyticsEnabled ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  send_page_view: false
                });
              `}
            </Script>
          </>
        ) : null}
        {isPostHogEnabled ? (
          <>
            <Script
              src={`${POSTHOG_HOST}/static/array.js`}
              strategy="afterInteractive"
            />
            <Script id="posthog-analytics" strategy="afterInteractive">
              {`
                window.posthog = window.posthog || [];
                if (typeof window.posthog.init === 'function') {
                  window.posthog.init('${POSTHOG_PROJECT_TOKEN}', {
                    api_host: '${POSTHOG_HOST}',
                    capture_pageview: false,
                    capture_pageleave: false
                  });
                  if (Array.isArray(window.__posthogEventQueue)) {
                    window.__posthogEventQueue.forEach(function(event) {
                      window.posthog.capture(event.name, event.properties);
                    });
                    window.__posthogEventQueue = [];
                  }
                }
              `}
            </Script>
          </>
        ) : null}
      </head>
      <body className="min-h-full bg-background text-foreground">
        <a
          href="#page-content"
          className="skip-link"
        >
          Skip to content
        </a>
        <div className="relative flex min-h-full flex-col">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,_rgba(31,41,55,1)_0%,_rgba(17,24,39,1)_100%)]" />
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
          <SiteHeader />
          <div id="page-content" tabIndex={-1} className="flex-1">
            {children}
          </div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
