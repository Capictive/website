import type { Metadata } from "next";
import "@/styles/globals.css";

import { Jost } from "next/font/google";
import { Google_Sans } from "next/font/google";

const googleSans = Google_Sans({ 
  variable: "--font-google-sans",
  subsets: ["latin"], 
  weight: ["400", "700"],
});

const jost = Jost({
  variable: "--font-jost",
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
        className={`${googleSans.variable} ${jost.variable} `}
      >
              <div className="bg-black absolute size-10 top-10 left-10">X</div>

        {children}
      </body>
    </html>
  );
}
