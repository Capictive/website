import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, CheckCircle2, FileCheck } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="py-20 px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-balance">
            Inteligencia y Transparencia en un solo lugar
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto text-pretty">
            Herramientas avanzadas para campañas efectivas y seguimiento gubernamental verificable
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Campaign AI */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">IA para Equipos de Campaña</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Análisis de sentimiento, generación de contenido y automatización para optimizar tu estrategia
                electoral.
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Government Tracking */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Seguimiento de Gobierno (Accountability)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Un tablero público que sigue en tiempo real las metas del plan de gobierno, con métricas y evidencias.
              </p>
            </CardContent>
          </Card>

          {/* Card 3: RAG & Verification */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Respuestas Verificadas (RAG)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Nuestro agente conversacional solo responde con información respaldada por nuestra base documental
                auditable.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
