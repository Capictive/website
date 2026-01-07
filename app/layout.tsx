import type { Metadata } from "next";
import "@/styles/globals.css";

import { Playpen_Sans } from "next/font/google";
import { Google_Sans } from "next/font/google";

const googleSans = Google_Sans({ 
  variable: "--font-google-sans",
  subsets: ["latin"], 
  weight: ["400", "700"],
});

const playpenSans = Playpen_Sans({
  variable: "--font-playpen-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Capictive",
  description: "Plataforma Politica para las Elecciones 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${googleSans.variable} ${playpenSans.variable} `}
      >

        {children}
      </body>
    </html>
  );
}
