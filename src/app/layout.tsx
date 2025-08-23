import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import ClientOnly from "@/components/clientOnly"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Wordywrites — Smarter Blog Creation with AI",
  description:
    "Generate high-quality, SEO-optimized blogs using AI agents. From keyword to published post in minutes — no writing experience needed.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
        <body className="font-sans bg-gradient-to-br from-[#f4f8ff] via-white to-[#fdf2f8] text-gray-800 min-h-screen antialiased">
          <ClientOnly>{children}</ClientOnly>
        </body>
      </html>
      

    </ClerkProvider>
  )
}
