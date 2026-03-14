import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@ots/ui/styles";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "OTS Guard",
  description: "Mobile app for Over Time Security guards",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ff6200",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-base text-text-primary font-sans antialiased">{children}</body>
    </html>
  );
}
