import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, Home, Video, Mic, Mail, Database, User, LogOut } from "lucide-react"

export default async function Navbar() {
    const user = null // TODO: Replace with actual user authentication logic

  const navLinks = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/videos", label: "Videos", icon: Video },
    { href: "/podcast", label: "Podcasts", icon: Mic },
    { href: "/newsletter", label: "Newsletter", icon: Mail },
    { href: "/database", label: "Base de Datos", icon: Database },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image src="/capictive-logo.png" alt="Capictive" width={40} height={40} className="rounded-full" />
            <div className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">Capictive</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-wood/20 text-wood hover:bg-mustard/10 bg-transparent"
                  >
                    Dashboard
                  </Button>
                </Link>
                <form action="/auth/signout" method="post">
                  <Button type="submit" variant="default" size="sm">
                    Cerrar Sesión
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          
        </div>
      </div>
    </nav>
  )
}

export { Navbar }
