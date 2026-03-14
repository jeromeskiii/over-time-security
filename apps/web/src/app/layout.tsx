import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@ots/ui/styles";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Over Time Security | California Private Security Services",
  description:
    "Professional armed and unarmed security guards, mobile patrols, fire watch, and executive protection services throughout California.",
  keywords: [
    "security guards",
    "private security",
    "armed security",
    "fire watch",
    "mobile patrol",
    "California security",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-base text-text-primary font-sans antialiased">
        <div className="relative min-h-screen overflow-x-clip">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
