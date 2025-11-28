import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import ClientOnly from "@/components/clientOnly"
import { Analytics } from "@vercel/analytics/next"
import SWRProvider from "@/app/providers/SWRProvider"
import Script from "next/script"
import { Space_Grotesk, IBM_Plex_Serif, Literata } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "next-themes"

import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-serif",
  display: "swap",
})

const literata = Literata({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-literata",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Wordywrites — Smarter Blog Creation with AI",
  description:
    "Generate high-quality, SEO-optimized blogs using AI agents. From keyword to published post in minutes — no writing experience needed.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${ibmPlexSerif.variable} ${literata.variable}`}>
        <head>
          <Script
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-PL4XKQRECG"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PL4XKQRECG');
            `}
          </Script>
        </head>

        <body className="font-sans bg-background text-foreground min-h-screen antialiased">
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <SWRProvider>
              <ClientOnly>
                {children}
                <Toaster position="top-right" />
              </ClientOnly>
            </SWRProvider>
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
