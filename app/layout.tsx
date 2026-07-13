import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ConvexClientProvider } from "@/app/ConvexClientProvider"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getToken } from "@/lib/auth-server"
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

const displaySerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const token = await getToken()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
        displaySerif.variable,
      )}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <ConvexClientProvider initialToken={token}>
              {children}
            </ConvexClientProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
