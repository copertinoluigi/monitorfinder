import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/Analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monitor Finder - Trova il Monitor Gaming e Ufficio Ideale",
  description: "Confronta Hz, risoluzioni e prezzi dei migliori monitor PC. Recensioni basate su IA e schede tecniche dettagliate per Gamer e Professionisti.",
  icons: {
    icon: '/favicon.ico', // Assicurati di avere una favicon se vuoi
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        {/* Placeholder per script aggiuntivi */}
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50`}>
        <Analytics />
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}