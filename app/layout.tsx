import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ConvexClientProvider } from "@/app/ConvexClientProvider"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const siteDescription =
  "Hyperliquid whale tracker with cross-wallet clustering. Detect coordinated groups from shared funding and correlated trading."

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000")

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hypertrace",
    template: "%s · Hypertrace",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: "Hypertrace",
    title: "Hypertrace",
    description: siteDescription,
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Hypertrace" }],
  },
  twitter: {
    card: "summary",
    title: "Hypertrace",
    description: siteDescription,
    images: ["/logo.png"],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
