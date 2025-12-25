import Link from "next/link"
import { Twitter, Send, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-12 px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-sm text-muted-foreground">© 2025 Capictive. Todos los derechos reservados.</div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <Link
              href="https://twitter.com/capictive"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link
              href="https://instagram.com/capictive"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </Link>
            <Link
              href="https://t.me/capictive_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Telegram"
            >
              <Send className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Términos de Servicio
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
