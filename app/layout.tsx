import { Geist_Mono, DM_Sans } from "next/font/google"
import type { Metadata } from "next"
import OneSignalInit from "@/components/OneSignalInit"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Nexa",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
  },
}

export const instant = false

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", dmSans.variable)}
    >
      <body>
        <OneSignalInit />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
