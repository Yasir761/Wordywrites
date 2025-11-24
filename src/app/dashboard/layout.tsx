import { ReactNode } from "react"
import { DashboardShell } from "@/components/shell"
import { Space_Grotesk, IBM_Plex_Serif, Literata } from 'next/font/google';


const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-serif',
  display: 'swap',
});

const literata = Literata({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-literata',
  display: 'swap',
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`
        min-h-screen w-full 
        bg-background 
        text-foreground
        font-[family-name:var(--font-space-grotesk)]
        antialiased
        ${spaceGrotesk.variable} 
        ${ibmPlexSerif.variable} 
        ${literata.variable}
      `}
    >
      <DashboardShell>
        {children}
      </DashboardShell>
    </div>
  )
}
