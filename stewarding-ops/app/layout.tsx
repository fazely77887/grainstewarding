import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Archivo({ subsets: ["latin"], variable: "--font-sans", weight: ["400","500","600","700","800","900"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400","500","600","700"] });

export const metadata: Metadata = {
  title: "Stewarding Ops Control Center",
  description: "HACCP-aligned stewarding operations dashboard — deep cleaning, QC inspections, disposal timing, red tag and defect management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
