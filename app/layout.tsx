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
  metadataBase: new URL('https://capictive.app'),
  title: {
    template: '%s | Capictive',
    default: 'Capictive - Tu Guía Electoral para Perú 2026',
  },
  description: 'Descubre candidatos, compara propuestas y prepárate para las Elecciones Generales Perú 2026. Información neutral, clara y fácil de entender.',
  keywords: ['Elecciones 2026', 'Perú', 'Candidatos', 'Partidos Políticos', 'Voto Informado', 'Simulacro Votación', 'Capictive'],
  authors: [{ name: 'Capictive Team' }],
  creator: 'Capictive',
  publisher: 'Capictive',
  openGraph: {
    title: 'Capictive - Tu Guía Electoral para Perú 2026',
    description: 'Plataforma interactiva para informarte sobre candidatos, partidos y propuestas para las Elecciones 2026.',
    url: 'https://capictive.app',
    siteName: 'Capictive',
    locale: 'es_PE',
    type: 'website',
    images: [
      {
        url: '/og-image.png', // Asegúrate de tener esta imagen en public/
        width: 1200,
        height: 630,
        alt: 'Capictive - Elecciones Perú 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Capictive - Tu Guía Electoral para Perú 2026',
    description: 'Descubre candidatos, compara propuestas y prepárate para las Elecciones Generales Perú 2026.',
    creator: '@capictive',
  },
  robots: {
    index: true,
    follow: true,
  },
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
