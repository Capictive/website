import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"

const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Capictive - AI para Campañas y Seguimiento de Gobierno",
  description: "El agente de IA para procesos electorales y seguimiento gubernamental transparente",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${montserrat.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
