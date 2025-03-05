import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "Advisa | Marketing Intelligence Platform",
    template: "%s | Advisa"
  },
  description: "Advanced marketing intelligence platform for data-driven marketing strategies",
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon.ico',
        media: '(prefers-color-scheme: dark)',
      }
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
      },
      {
        url: '/apple-touch-icon.png',
        media: '(prefers-color-scheme: dark)',
      }
    ],
  },
  manifest: '/site.webmanifest',
  applicationName: 'Advisa',
  keywords: ['marketing', 'analytics', 'intelligence', 'dashboard', 'seo', 'ad performance'],
  authors: [{ name: 'Advisa Team' }],
  creator: 'Advisa',
  publisher: 'Advisa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}