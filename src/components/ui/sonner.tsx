"use client"

import * as React from "react"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ className, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      closeButton
      position="top-right"
      duration={2800}
      expand={true}
      className="toaster group font-sans"
      toastOptions={{
        className:
          "group/toast glass border border-white/20 backdrop-blur-xl shadow-lg transition-all duration-300 rounded-xl px-4 py-3",
        style: {
          background: "rgba(255, 255, 255, 0.65)",
          backdropFilter: "blur(14px)",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-green-600" />,
        info: <InfoIcon className="size-5 text-blue-600" />,
        warning: <TriangleAlertIcon className="size-5 text-yellow-600" />,
        error: <OctagonXIcon className="size-5 text-red-600" />,
        loading: <Loader2Icon className="size-5 animate-spin text-purple-600" />,
      }}
      style={
        {
          "--normal-bg": "rgba(255,255,255,0.65)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--radius": "0.8rem",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
