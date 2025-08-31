// import type { Metadata } from "next"
// import { Inter, Poppins } from "next/font/google"
// import { ClerkProvider } from "@clerk/nextjs"
// import ClientOnly from "@/components/clientOnly"
// import Script from "next/script"
// import "./globals.css"

// const inter = Inter({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-inter",
// })

// const poppins = Poppins({
//   subsets: ["latin"],
//   display: "swap",
//   weight: ["600", "700"],
//   variable: "--font-poppins",
// })

// export const metadata: Metadata = {
//   title: "Wordywrites — Smarter Blog Creation with AI",
//   description:
//     "Generate high-quality, SEO-optimized blogs using AI agents. From keyword to published post in minutes — no writing experience needed.",
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <ClerkProvider>
//       <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
//         <body className="font-sans bg-gradient-to-br from-[#f4f8ff] via-white to-[#fdf2f8] text-gray-800 min-h-screen antialiased">
//           <ClientOnly>{children}</ClientOnly>

//           {/* Google Analytics Script */}
//           <Script
//             src={`https://www.googletagmanager.com/gtag/js?id=G-PL4XKQRECG`}
//             strategy="afterInteractive"
//           />
//           <Script id="google-analytics" strategy="afterInteractive">
//             {`
//               window.dataLayer = window.dataLayer || [];
//               function gtag(){dataLayer.push(arguments);}
//               gtag('js', new Date());
//               gtag('config', 'G-PL4XKQRECG');
//             `}
//           </Script>
//         </body>
//       </html>
//     </ClerkProvider>
//   )
// }



import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import ClientOnly from "@/components/clientOnly"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
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
        <head>
          {/* TrackTheMetric Script */}
          <script
  id="TrackTheMetric"
  data-website-id="c9e67e29-5db9-4448-b593-ae942ec8d335"
  data-domain="wordywrites.app"
  src="https://app.trackthemetric.com/tracker.js"
  defer
></script>
          {/* Google Analytics Script */}
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=G-PL4XKQRECG`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
          >
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PL4XKQRECG');
            `}
          </Script>
        </head>
        <body className="font-sans bg-gradient-to-br from-[#f4f8ff] via-white to-[#fdf2f8] text-gray-800 min-h-screen antialiased">
          <ClientOnly>{children}</ClientOnly>
          {/* ✅ Vercel Analytics */}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
