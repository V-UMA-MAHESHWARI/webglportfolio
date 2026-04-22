import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0a0804",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://umamaheshwari.dev"), // Replace with actual domain before deployment
  title: {
    default: "Uma Maheshwari | Full-Stack AI & WebGL Developer",
    template: "%s | Uma Maheshwari",
  },
  description:
    "Portfolio of Uma Maheshwari, a Full-Stack Developer specializing in React, Next.js, 3D WebGL (Three.js), and AI automations. I build digital experiences that move, breathe, and belong to the future.",
  keywords: [
    "Uma Maheshwari",
    "Portfolio",
    "Full-Stack Developer",
    "Frontend Developer",
    "React",
    "Next.js",
    "Three.js",
    "WebGL",
    "AI Automations",
    "Python",
    "Software Engineer",
  ],
  authors: [{ name: "Uma Maheshwari", url: "https://umamaheshwari.dev" }],
  creator: "Uma Maheshwari",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://umamaheshwari.dev",
    title: "Uma Maheshwari | Full-Stack AI & WebGL Developer",
    description:
      "Portfolio of Uma Maheshwari, a Full-Stack Developer specializing in React, Next.js, 3D WebGL (Three.js), and AI automations.",
    siteName: "Uma Maheshwari Portfolio",
    images: [
      {
        url: "/og-image.jpg", // Create a 1200x630 image in public folder
        width: 1200,
        height: 630,
        alt: "Uma Maheshwari — Developer. Creator. Architect of Experiences.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uma Maheshwari | Full-Stack AI & WebGL Developer",
    description:
      "Portfolio of Uma Maheshwari, a Full-Stack Developer specializing in React, Next.js, 3D WebGL (Three.js), and AI automations.",
    creator: "@umamaheshwari", // Replace with your actual Twitter handle
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "PASTE_GOOGLE_VERIFICATION_CODE_HERE",
    // Bing Webmaster Tools natively uses "msvalidate.01"
    other: {
      "msvalidate.01": "PASTE_BING_VERIFICATION_CODE_HERE",
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}