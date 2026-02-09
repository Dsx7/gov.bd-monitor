import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner"; // 🟢 Added Sonner Toaster
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gov.bd Monitor - Real-time Government Website Status",
  description: "Check the uptime and status of all Bangladesh government websites (gov.bd) in real-time. Monitor ministries, departments, and utility services instantly.",
  keywords: ["gov.bd uptime", "Bangladesh government website status", "is gov bd down", "NID server status", "passport status check", "Bangladesh server monitor"],
  authors: [{ name: "Gov Monitor Team" }],
  openGraph: {
    title: "Gov.bd Monitor - Is the server down?",
    description: "Real-time availability monitoring for Bangladesh government digital services.",
    url: "https://your-domain.com",
    siteName: "Gov.bd Monitor",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg", // You can add an image later
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gov.bd Monitor - Real-time Status",
    description: "Check if NID, Passport, or other Gov.bd sites are down.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href="https://your-domain.com" />
      </head>
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        {children}
        
        {/* 🟢 Added Toaster for Notifications */}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}