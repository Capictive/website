import { Button } from "@/components/ui/button"
import { MessageCircle, Send } from "lucide-react"

export function CTASection() {
  const telegramUrl = "https://t.me/capictive_bot"

  return (
    <section id="get-started" className="py-24 px-6 lg:px-8 bg-card/30">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">¿Listo para empezar?</h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-pretty">
          Chatea con Capictive AI ahora mismo y descubre cómo podemos ayudarte con tu campaña o seguimiento
          gubernamental.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="min-w-[220px] cursor-not-allowed opacity-70" disabled>
            <MessageCircle className="w-5 h-5 mr-2" />
            WhatsApp (Próximamente)
          </Button>
          <Button size="lg" variant="outline" className="min-w-[220px] bg-transparent cursor-pointer" asChild>
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
              <Send className="w-5 h-5 mr-2" />
              Chatear por Telegram
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
