import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    template: '%s | Clone Legends',
    default: 'Clone Legends',
  },
  description: "League of Legends Client Clone",
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#010A13',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
