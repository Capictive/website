import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div className="container mx-auto max-w-4xl text-center">
        {/* Main Heading with mixed typography */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 text-balance">
          <span className="text-muted-foreground">{"Inteligencia y "}</span>
          <span className="text-foreground">transparencia</span>
        </h1>

        {/* Subtitle */}
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-foreground mb-3 sm:mb-4 text-balance px-4">
          El Agente de IA para Campañas Electorales
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed text-pretty px-4">
          Combinamos análisis de datos para campañas con un seguimiento transparente y verificable de las acciones del
          gobierno en funciones. Todo basado en fuentes documentales.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
          {/* Sends to dashboard; middleware redirects to /login if not authenticated */}
          <Button size="lg" className="w-full sm:w-auto min-w-[200px] cursor-pointer" asChild>
            <Link href="/dashboard">Empezar a hablar</Link>
          </Button>
          {/* Scroll down to CTA section ("¿Listo para empezar?") */}
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto min-w-[200px] bg-transparent cursor-pointer"
            asChild
          >
            <a href="#get-started">Chatear por Telegram</a>
          </Button>
        </div>

        {/* Platform availability text */}
        <p className="text-xs sm:text-sm text-muted-foreground mt-6 sm:mt-8">
          Disponible para equipos de campaña y ciudadanos
        </p>
      </div>
    </section>
  )
}
