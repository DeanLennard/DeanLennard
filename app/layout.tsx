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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shouldLoadGa = isAnalyticsEnabled;
  const shouldLoadPostHog = isPostHogEnabled;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {shouldLoadGa ? (
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
        {shouldLoadPostHog ? (
          <Script id="posthog-analytics" strategy="afterInteractive">
            {`
              !function(t,e){
                var o,n,p,r;
                if(!e.__SV){
                  window.posthog=e;
                  e._i=[];
                  e.init=function(i,s,a){
                    function g(t,e){
                      var o=e.split(".");
                      if(o.length===2){
                        t=t[o[0]];
                        e=o[1];
                      }
                      t[e]=function(){
                        t.push([e].concat(Array.prototype.slice.call(arguments,0)));
                      };
                    }
                    (p=t.createElement("script")).type="text/javascript";
                    p.crossOrigin="anonymous";
                    p.async=!0;
                    p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js";
                    (r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);
                    var u=e;
                    if(a!==undefined){
                      u=e[a]=[];
                    } else {
                      a="posthog";
                    }
                    u.people=u.people||[];
                    u.toString=function(t){
                      var e="posthog";
                      if(a!=="posthog"){
                        e+="."+a;
                      }
                      if(!t){
                        e+=" (stub)";
                      }
                      return e;
                    };
                    u.people.toString=function(){
                      return u.toString(1)+".people (stub)";
                    };
                    o="init capture register register_once register_for_session unregister unregister_for_session identify alias set_config reset opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing onFeatureFlags onSessionId".split(" ");
                    for(n=0;n<o.length;n++){
                      g(u,o[n]);
                    }
                    e._i.push([i,s,a]);
                  };
                  e.__SV=1;
                }
              }(document,window.posthog||[]);
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
            `}
          </Script>
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
