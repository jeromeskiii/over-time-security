import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@ots/ui/styles";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Over Time Security | Operations Portal",
  description: "Internal operations management for Over Time Security",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-base text-text-primary font-sans antialiased">{children}</body>
    </html>
  );
}
