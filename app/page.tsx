"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import logo from "@/public/capictive.png";
import Nav from "./components/Nav";

const partyLogos = [
  "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743028/Capictive/Logo/ahora_nacion_logo.png",
  "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743030/Capictive/Logo/alianza_para_el_progreso_logo.png",
  "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743031/Capictive/Logo/avanza_pais_logo.png",
  "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743033/Capictive/Logo/fuerza_popular_logo.png",
  "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743036/Capictive/Logo/partido_aprista_peruano_logo.png",
  "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743040/Capictive/Logo/partido_morado_logo.png",
  "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743047/Capictive/Logo/renovacion_popular_logo.png",
  "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743042/Capictive/Logo/peru_libre_logo.png",
  "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743046/Capictive/Logo/podemos_peru_logo.png",
  "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743050/Capictive/Logo/somos_peru_logo.svg",
  "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743032/Capictive/Logo/cooperacion_popular_logo.png",
  "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743048/Capictive/Logo/salvemos_al_peru_logo.png",
];

export default function Home() {
  const [logoIndex, setLogoIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setLogoIndex((prev) => (prev + 3) % partyLogos.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const visibleLogos = [
    partyLogos[logoIndex % partyLogos.length],
    partyLogos[(logoIndex + 1) % partyLogos.length],
    partyLogos[(logoIndex + 2) % partyLogos.length],
  ];

  return (
    <main>
      <Nav />
      {/* Hero Header */}
      <div className="p-6 md:p-10 border-b border-subtitle   ">
        <div className="flex gap-4 justify-center items-center">
          <Image
            src={logo}
            alt="Capictive Logo"
            width={120}
            height={120}
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36"
          />
          <h1 className="font-title text-title font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight">
            Capictive
          </h1>
        </div>
      </div>

      {/* Info bar */}
      <div className="p-3 text-sm font-body flex flex-wrap justify-between gap-2 ">
        <p>Miércoles, <strong>07 de Enero del 2026</strong></p>
        <p className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <strong>41</strong> días para el Debate
        </p>
      </div>

      {/* Hero Section */}
      <div className="mt-6 py-16 border-y font-title text-center border-subtitle relative overflow-hidden">
        <div className="absolute inset-0  from-button-background-primary/5 to-transparent"></div>
        <p className="text-3xl sm:text-4xl md:text-7xl text-subtitle font-title font-extrabold relative z-10">
          Tenemos un Problema
        </p>
        <p className="font-body text-lg mt-2 relative z-10">O bueno... varios 🤔</p>
      </div>

      {/* Partidos Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-6 items-center">
        {/* Logo Animation */}
        <div className="flex justify-center items-center py-8 md:py-12">
          <div className="relative">
            <div className={`flex gap-4 sm:gap-6 transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              {visibleLogos.map((logoUrl, index) => (
                <div
                  key={`${logoIndex}-${index}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl bg-white shadow-lg p-3 flex items-center justify-center transform hover:scale-110 transition-transform duration-200"
                >
                  <Image
                    src={logoUrl}
                    alt={`Partido ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-contain w-full h-full"
                  />
                </div>
              ))}
            </div>
            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: Math.ceil(partyLogos.length / 3) }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    Math.floor(logoIndex / 3) === i ? 'bg-button-background-primary' : 'bg-button-background-secondary'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="p-6 space-y-5 flex flex-col justify-center">
          <h3 className="font-title text-subtitle text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            +34 Partidos Políticos
          </h3>
          <p className="font-body text-base sm:text-lg leading-relaxed">
            En estas elecciones tenemos más de 34 partidos políticos compitiendo. 
            Cada uno con propuestas, candidatos y planes de gobierno diferentes. 
            <strong className="text-button-background-primary"> ¿Cómo elegir?</strong> 
            {" "}Nosotros te ayudamos a entender sus propuestas de forma simple y clara.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/partidos" className="btn-primary text-center text-lg py-3">
              🗳️ Revisar Partidos
            </Link>
            <Link href="/candidatos" className="btn-secondary text-center text-lg py-3">
              👤 Ver Candidatos
            </Link>
          </div>
        </div>
      </div>

      {/* Secciones de estilo periódico */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 border-t pt-10 border-subtitle">
        <article className="col-span-1 md:col-span-2 space-y-4 p-6 rounded-xl bg-white/50 shadow-sm">
          <div className="flex items-center gap-2 text-button-background-primary">
            <span className="text-2xl">📰</span>
            <span className="text-sm font-bold uppercase tracking-wide">Exclusivo</span>
          </div>
          <h2 className="font-title text-subtitle text-3xl md:text-4xl font-extrabold">Entrevistas con Expertos</h2>
          <p className="font-body text-base leading-relaxed">
            Conversamos con especialistas en políticas públicas para darte opiniones, 
            datos y un resumen imparcial que te ayude a decidir informadamente.
          </p>
          <button className="btn-secondary text-sm w-fit font-body flex items-center gap-2">
            <span>Leer entrevistas</span>
            <span>→</span>
          </button>
        </article>
        <aside className="space-y-4 p-6 rounded-xl bg-button-background-secondary/30">
          <div className="flex items-center gap-2 text-subtitle">
            <span className="text-2xl">📜</span>
            <span className="text-sm font-bold uppercase tracking-wide">Historia</span>
          </div>
          <h3 className="font-title text-subtitle text-2xl md:text-3xl font-bold">Hechos Históricos</h3>
          <p className="font-body">
            Momentos clave de la política peruana que ayudan a entender el presente electoral.
          </p>
          <button className="btn-secondary text-sm w-fit font-body flex items-center gap-2">
            <span>Ver cronología</span>
            <span>→</span>
          </button>
        </aside>
      </section>

      {/* Stats Section */}
      <section className="mt-12 py-10 border-y border-subtitle">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <p className="font-title text-4xl md:text-5xl font-bold text-button-background-primary">34+</p>
            <p className="font-body text-sm">Partidos Políticos</p>
          </div>
          <div className="space-y-2">
            <p className="font-title text-4xl md:text-5xl font-bold text-button-background-primary">100+</p>
            <p className="font-body text-sm">Propuestas Analizadas</p>
          </div>
          <div className="space-y-2">
            <p className="font-title text-4xl md:text-5xl font-bold text-button-background-primary">41</p>
            <p className="font-body text-sm">Días para el Debate</p>
          </div>
          <div className="space-y-2">
            <p className="font-title text-4xl md:text-5xl font-bold text-button-background-primary">∞</p>
            <p className="font-body text-sm">Tu Decisión Importa</p>
          </div>
        </div>
      </section>

      {/* Redes sociales */}
      <footer className="mt-12 border-t p-8 border-subtitle text-center">
        <p className="font-body text-lg mb-4">Síguenos en redes sociales</p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 font-body">
          <a href="https://facebook.com/capictive" className="btn-secondary flex items-center gap-2">
            <Image src="/logos/facebook.png" alt="Facebook" width={20} height={20} />
            Facebook
          </a>
          <a href="https://instagram.com/capictive" className="btn-secondary flex items-center gap-2">
            <Image src="/logos/instagram.png" alt="Instagram" width={20} height={20} />
            Instagram
          </a>
          <a href="https://tiktok.com/@capictive" className="btn-secondary flex items-center gap-2">
            <Image src="/logos/tiktok.png" alt="TikTok" width={20} height={20} />
            TikTok
          </a>
        </div>
        <p className="font-body text-xs mt-6 text-subtitle/60">
          © 2026 Capictive. Información electoral para todos.
        </p>
      </footer>
    </main>
  );
}
