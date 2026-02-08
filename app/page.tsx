"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import logo from "@/public/capictive.png";
import Nav from "./components/Nav";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

/* ─── Tour Steps ─── */
const TOUR_STEPS: Step[] = [
  {
    target: "body",
    content:
      "¡Bienvenido a Capictive! 🇵🇪 Tu plataforma para informarte sobre las elecciones Perú 2026. Te guiaremos por las funciones principales en unos segundos.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: ".tour-nav-partidos",
    content:
      "🗳️ Partidos Políticos: Aquí puedes explorar los 34+ partidos, ver sus ejes de gobierno, problemas identificados, escándalos y hasta hacerle preguntas a la IA sobre sus propuestas.",
    placement: "bottom",
  },
  {
    target: ".tour-nav-comparar",
    content:
      "📊 Comparar: Utiliza gráficos interactivos (Radar, Diagrama de Nolan, Nube de Palabras) para comparar las posturas ideológicas de los partidos entre sí.",
    placement: "bottom",
  },
  {
    target: ".tour-nav-candidatos",
    content:
      "👤 Candidatos: Busca candidatos por departamento, cargo o partido. Ve su hoja de vida, experiencia, antecedentes, y marca tus favoritos.",
    placement: "bottom",
  },
  {
    target: ".tour-simulacro",
    content:
      "🗳️ Simulacro de Votación: Practica tu voto con una cédula interactiva idéntica a la real. Elige presidente, senadores, diputados y parlamento andino. Usa el voto preferencial escribiendo los números de tus candidatos favoritos en las casillas.",
    placement: "top",
  },
  {
    target: ".tour-timeline",
    content:
      "📅 Línea de Tiempo: Sigue el calendario electoral completo. Haz clic en cada punto para ver qué sucede en cada fecha importante hasta el día de la elección.",
    placement: "top",
  },
  {
    target: "body",
    content:
      "¡Listo! Ya conoces las herramientas principales. Explora, compara y decide con información. Tu voto importa. 🌟",
    placement: "center",
  },
];

const TOUR_IMAGES: Record<number, string> = {
  0: "/pose/searching.png",
  1: "/pose/reading.png",
  2: "/pose/giveme.png",
  3: "/pose/searching.png",
  4: "/pose/sending.png",
  5: "/pose/reading.png",
  6: "/pose/lost.png",
};

/* ─── Custom Tooltip ─── */
interface CustomTooltipProps {
  continuous: boolean;
  index: number;
  step: Step;
  backProps: React.HTMLAttributes<HTMLButtonElement>;
  primaryProps: React.HTMLAttributes<HTMLButtonElement>;
  skipProps: React.HTMLAttributes<HTMLButtonElement>;
  tooltipProps: React.HTMLAttributes<HTMLDivElement>;
  isLastStep: boolean;
}

const CustomTooltip = ({
  continuous,
  index,
  step,
  backProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep,
}: CustomTooltipProps) => (
  <div
    {...tooltipProps}
    className="bg-white rounded-2xl shadow-2xl p-0 max-w-sm overflow-hidden"
  >
    {TOUR_IMAGES[index] && (
      <div className="bg-linear-to-br from-button-background-primary/20 to-button-background-secondary flex justify-center py-4">
        <Image
          src={TOUR_IMAGES[index]}
          alt="Tour illustration"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>
    )}
    <div className="p-5">
      {step.title && (
        <h3 className="font-title text-subtitle text-lg font-bold mb-2">
          {step.title}
        </h3>
      )}
      <p className="font-body text-subtitle/80 text-sm leading-relaxed">
        {step.content}
      </p>
      <div className="flex gap-1 mt-4 mb-3">
        {TOUR_STEPS.map((_, i) => (
          <div
            key={`step-${i}`}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= index ? "bg-button-background-primary" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-4">
        <button
          {...skipProps}
          className="text-xs font-body text-gray-400 hover:text-gray-600 transition-colors"
        >
          Saltar tour
        </button>
        <div className="flex gap-2">
          {index > 0 && (
            <button
              {...backProps}
              className="px-3 py-1.5 text-sm font-body text-subtitle hover:bg-gray-100 rounded-lg transition-colors"
            >
              Atrás
            </button>
          )}
          {continuous && (
            <button
              {...primaryProps}
              className="px-4 py-1.5 text-sm font-body font-bold bg-button-background-primary text-white rounded-lg hover:bg-button-background-primary/90 transition-colors"
            >
              {isLastStep ? "¡Explorar!" : "Siguiente"}
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

const timelineEvents = [
  {
    date: "2025-03-25",
    event: "Convocatoria a Elecciones",
    description:
      "Publicación del Decreto Supremo N.º 039-2025-PCM oficializando el llamado a elecciones.",
    category: "legal",
    status: "past",
  },
  {
    date: "2025-11-30",
    event: "Elecciones Primarias",
    description: "Votación interna de partidos para definir sus candidatos.",
    category: "voting",
    status: "past",
  },
  {
    date: "2025-12-23",
    event: "Cierre de Inscripción de Listas",
    description:
      "Fecha límite para presentar solicitudes de inscripción de fórmulas presidenciales y parlamentarias.",
    category: "registration",
    status: "past",
  },
  {
    date: "2025-12-24",
    event: "Publicación de Hojas de Vida",
    description:
      "Planes de gobierno y hojas de vida disponibles al público en el portal del JNE.",
    category: "transparency",
    status: "past",
  },
  {
    date: "2026-01-29",
    event: "Sorteo de Miembros de Mesa",
    description:
      "La ONPE realiza el sorteo público de los 3 titulares y 6 suplentes por mesa.",
    category: "logistics",
    status: "upcoming",
  },
  {
    date: "2026-02-11",
    event: "Publicación de Listas Admitidas",
    description:
      "Fecha límite para publicar las listas que pasaron la primera revisión (inicia periodo de tachas).",
    category: "registration",
    status: "upcoming",
  },
  {
    date: "2026-02-26",
    event: "Resolución de Tachas (1.ª instancia)",
    description:
      "Plazo máximo para que los Jurados Electorales Especiales resuelvan tachas ciudadanas.",
    category: "legal",
    status: "upcoming",
  },
  {
    date: "2026-03-14",
    event: "Inscripción Definitiva de Listas",
    description:
      "Fecha límite tras apelaciones. Se define oficialmente quiénes aparecerán en la cédula.",
    category: "registration",
    status: "upcoming",
  },
  {
    date: "2026-03-30",
    event: "Debates Presidenciales (Estimado)",
    description:
      "Inicio de la semana de debates escalonados (fecha exacta por confirmar tras inscripción definitiva).",
    category: "debate",
    status: "upcoming",
  },
  {
    date: "2026-04-10",
    event: "Inicio de Ley Seca",
    description:
      "Prohibición de venta de alcohol desde las 8:00 a.m. (48 horas antes de la elección).",
    category: "logistics",
    status: "upcoming",
  },
  {
    date: "2026-04-12",
    event: "Día de la Elección (Primera Vuelta)",
    description:
      "Votación general para Presidente, Vicepresidentes, Congreso y Parlamento Andino.",
    category: "voting",
    status: "upcoming",
  },
  {
    date: "2026-06-07",
    event: "Segunda Vuelta (Proyectada)",
    description:
      "Fecha probable en caso de que ningún candidato supere el 50% de votos válidos.",
    category: "voting",
    status: "upcoming",
  },
];

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

const FechaActual = () => {
  // Inicializamos con null para evitar errores de hidratación (diferencia servidor/cliente)
  const [fecha, setFecha] = useState<Date | null>(null);

  useEffect(() => {
    setFecha(new Date()); // Seteamos fecha inicial en el cliente
    const timer = setInterval(() => setFecha(new Date()), 60000); // Actualiza cada minuto
    return () => clearInterval(timer);
  }, []);

  if (!fecha) return null; // O un skeleton loader si prefieres

  const capitalizar = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const partes = new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).formatToParts(fecha);

  const diaSemana = capitalizar(
    partes.find((p) => p.type === "weekday")?.value || "",
  );
  const diaMes = partes.find((p) => p.type === "day")?.value;
  const mes = capitalizar(partes.find((p) => p.type === "month")?.value || "");
  const anio = partes.find((p) => p.type === "year")?.value;

  return (
    <span>
      {diaSemana},{" "}
      <strong>
        {diaMes} de {mes} del {anio}
      </strong>
    </span>
  );
};

export default function Home() {
  const [logoIndex, setLogoIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  // Tour state
  const [runTour, setRunTour] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("home-tour-completed");
    if (!seen) {
      const t = setTimeout(() => setRunTour(true), 1000);
      return () => clearTimeout(t);
    } else {
      setTourCompleted(true);
    }
  }, []);

  const handleTourCallback = useCallback((data: CallBackProps) => {
    const finished: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finished.includes(data.status)) {
      setRunTour(false);
      setTourCompleted(true);
      localStorage.setItem("home-tour-completed", "true");
    }
  }, []);

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

  // Calcular el próximo evento y días restantes
  const getNextEvent = () => {
    const today = new Date();
    for (let i = 0; i < timelineEvents.length; i++) {
      const eventDate = new Date(timelineEvents[i].date);
      if (eventDate >= today) {
        const diffTime = eventDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { event: timelineEvents[i], daysLeft: diffDays };
      }
    }
    return null;
  };

  const nextEvent = getNextEvent();

  const visibleLogos = [
    partyLogos[logoIndex % partyLogos.length],
    partyLogos[(logoIndex + 1) % partyLogos.length],
    partyLogos[(logoIndex + 2) % partyLogos.length],
  ];

  return (
    <main>
      {/* Joyride */}
      <Joyride
        steps={TOUR_STEPS}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        callback={handleTourCallback}
        tooltipComponent={CustomTooltip}
        floaterProps={{ styles: { arrow: { color: "#fff" } } }}
        styles={{
          options: { overlayColor: "rgba(80, 50, 36, 0.5)", zIndex: 10000 },
        }}
      />

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
        <p>
          <FechaActual />
        </p>
        {nextEvent && (
          <p className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <strong>{nextEvent.daysLeft}</strong> días para{" "}
            {nextEvent.event.event}
          </p>
        )}
      </div>

      {/* Hero Section */}
      <div className="mt-6 py-16 border-y font-title text-center border-subtitle relative overflow-hidden">
        <div className="absolute inset-0  from-button-background-primary/5 to-transparent"></div>
        <p className="text-3xl sm:text-4xl md:text-7xl text-subtitle font-title font-extrabold relative z-10">
          Tenemos un Problema
        </p>
        <p className="font-body text-lg mt-2 relative z-10">
          O bueno... varios 🤔
        </p>
        {tourCompleted && (
          <button
            onClick={() => setRunTour(true)}
            className="mt-3 text-xs font-body text-button-background-primary hover:underline relative z-10"
          >
            🎯 Ver tutorial nuevamente
          </button>
        )}
      </div>

      {/* Partidos Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-6 items-center">
        {/* Logo Animation */}
        <div className="flex justify-center items-center py-8 md:py-12">
          <div className="relative">
            <div
              className={`flex gap-4 sm:gap-6 transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
            >
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
              {Array.from({ length: Math.ceil(partyLogos.length / 3) }).map(
                (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      Math.floor(logoIndex / 3) === i
                        ? "bg-button-background-primary"
                        : "bg-button-background-secondary"
                    }`}
                  />
                ),
              )}
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="p-6 space-y-5 flex flex-col justify-center">
          <h3 className="font-title text-subtitle text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            +34 Partidos Políticos
          </h3>
          <p className="font-body text-base sm:text-lg leading-relaxed">
            En estas elecciones tenemos más de 34 partidos políticos
            compitiendo. Cada uno con propuestas, candidatos y planes de
            gobierno diferentes.
            <strong className="text-button-background-primary">
              {" "}
              ¿Cómo elegir?
            </strong>{" "}
            Nosotros te ayudamos a entender sus propuestas de forma simple y
            clara.
          </p>
          <div className="flex font-body flex-col sm:flex-row gap-3">
            <Link
              href="/partidos"
              className="btn-primary text-center text-lg py-3"
            >
              🗳️ Revisar Partidos
            </Link>
            <Link
              href="/candidatos"
              className="btn-secondary text-center text-lg py-3"
            >
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
            <span className="text-sm font-bold uppercase font-title tracking-wide">
              Exclusivo
            </span>
          </div>
          <h2 className="font-title text-subtitle text-3xl md:text-4xl font-extrabold">
            Transcripciones de Entrevistas
          </h2>
          <p className="font-body text-base leading-relaxed">
            Accede a transcripciones de entrevistas realizadas a representantes
            de los partidos políticos, donde explican sus propuestas y planes de
            gobierno de manera directa.
          </p>
          <button
            onClick={() => router.push("/partidos")}
            className="btn-secondary text-sm w-fit font-body flex items-center gap-2  "
          >
            <span> Revisar Aquí</span>
            <span>🔜</span>
          </button>
        </article>
        <aside className="space-y-4 p-6 rounded-xl bg-button-background-secondary/30">
          <div className="flex items-center gap-2 text-subtitle">
            <span className="text-2xl">📜</span>
            <span className="text-sm font-bold uppercase font-title tracking-wide">
              Historia
            </span>
          </div>
          <h3 className="font-title text-subtitle text-2xl md:text-3xl font-bold">
            Hechos Históricos
          </h3>
          <p className="font-body">
            Momentos clave de la política peruana que ayudan a entender el
            presente electoral.
          </p>
          <button
            className="btn-secondary text-sm w-fit font-body flex items-center gap-2 opacity-60 cursor-not-allowed"
            disabled
          >
            <span>Próximamente</span>
            <span>🔜</span>
          </button>
        </aside>
      </section>

      {/* Stats Section */}
      <section className="mt-12 py-10 border-y border-subtitle">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <p className="font-title text-4xl md:text-5xl font-bold text-button-background-primary">
              34+
            </p>
            <p className="font-body text-sm">Partidos Políticos</p>
          </div>
          <div className="space-y-2">
            <p className="font-title text-4xl md:text-5xl font-bold text-button-background-primary">
              100+
            </p>
            <p className="font-body text-sm">Propuestas Analizadas</p>
          </div>
          <div className="space-y-2">
            <p className="font-title text-4xl md:text-5xl font-bold text-button-background-primary">
              41
            </p>
            <p className="font-body text-sm">Días para el Debate</p>
          </div>
          <div className="space-y-2">
            <p className="font-title text-4xl md:text-5xl font-bold text-button-background-primary">
              ∞
            </p>
            <p className="font-body text-sm">Tu Decisión Importa</p>
          </div>
        </div>
      </section>

      {/* Simulacro de Votación (CTA) */}
      <section className="tour-simulacro py-16  border-y border-subtitle relative overflow-hidden group">
        <div className="absolute inset-0  opacity-5 scale-150 rotate-12 blur-sm group-hover:opacity-10 transition-opacity"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-title text-subtitle text-3xl md:text-5xl font-extrabold mb-6">
            🗳️ ¿Ya sabes cómo votar?
          </h2>
          <p className="font-body text-lg md:text-md text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            No esperes al domingo de elecciones. Practica tu voto ahora con
            nuestra{" "}
            <strong className="text-black">Cédula Virtual Interactiva</strong>.
            Aprende a usar el voto cruzado y preferencial sin errores.
          </p>

          <Link
            href="/simulacro"
            className="inline-flex items-center gap-3 bg-button-background-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-button-background-primary/80 hover:scale-105 transition-all shadow-xl"
          >
            PRACTICAR MI VOTO AHORA
            <ArrowRight size={24} />
          </Link>

          <p className="mt-4 text-xs text-gray-400 uppercase tracking-widest font-bold">
            Simulación Educativa • No oficial
          </p>
        </div>
      </section>

      {/* Timeline Electoral */}
      <TimelineElectoral />

      {/* Redes sociales */}
      <footer className="mt-12 border-t p-8 border-subtitle text-center">
        <p className="font-body text-lg mb-4">Síguenos en redes sociales</p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 font-body">
          <a
            href="https://facebook.com/capictive"
            className="btn-secondary flex items-center gap-2"
          >
            <Image
              src="/logos/facebook.png"
              alt="Facebook"
              width={20}
              height={20}
            />
            Facebook
          </a>
          <a
            href="https://instagram.com/capictive"
            className="btn-secondary flex items-center gap-2"
          >
            <Image
              src="/logos/instagram.png"
              alt="Instagram"
              width={20}
              height={20}
            />
            Instagram
          </a>
          <a
            href="https://tiktok.com/@capictive"
            className="btn-secondary flex items-center gap-2"
          >
            <Image
              src="/logos/tiktok.png"
              alt="TikTok"
              width={20}
              height={20}
            />
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

// Componente Timeline Electoral
function TimelineElectoral() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string; text: string; dot: string }> = {
      legal: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
      voting: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
      registration: {
        bg: "bg-green-100",
        text: "text-green-700",
        dot: "bg-green-500",
      },
      transparency: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        dot: "bg-purple-500",
      },
      logistics: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        dot: "bg-orange-500",
      },
      debate: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        dot: "bg-yellow-500",
      },
    };
    return colors[category] || colors.legal;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      legal: "⚖️",
      voting: "🗳️",
      registration: "📝",
      transparency: "👁️",
      logistics: "🏗️",
      debate: "🎤",
    };
    return icons[category] || "📅";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-PE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Determinar qué evento es el actual (el próximo evento upcoming)
  const getCurrentEventIndex = () => {
    const today = new Date();
    for (let i = 0; i < timelineEvents.length; i++) {
      const eventDate = new Date(timelineEvents[i].date);
      if (eventDate >= today) {
        return i;
      }
    }
    return timelineEvents.length - 1;
  };

  const currentEventIndex = getCurrentEventIndex();

  return (
    <div className="tour-timeline mt-6 py-8 border-y border-subtitle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-title text-subtitle text-3xl md:text-4xl font-bold mb-2">
            📅 Línea de Tiempo de Elecciones 2026
          </h2>
          <p className="font-body text-sm md:text-base text-subtitle/70">
            Haz clic en cada punto para saber más
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden md:block relative pb-16">
          {/* Línea principal */}
          <div className="absolute top-1/2 left-0 right-0 h-1  transform -translate-y-1/2"></div>

          <div className="flex justify-between items-center relative">
            {timelineEvents.map((event, index) => {
              const colors = getCategoryColor(event.category);
              const isSelected = selectedEvent === index;
              const isPast = event.status === "past";
              const isCurrent = index === currentEventIndex;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center relative group"
                >
                  {/* Punto clickeable */}
                  <button
                    onClick={() => setSelectedEvent(isSelected ? null : index)}
                    className={`w-6 h-6 rounded-full border-4 border-white shadow-lg transition-all duration-300 z-10 ${
                      colors.dot
                    } ${
                      isSelected
                        ? "scale-150 ring-4 ring-button-background-primary/30"
                        : "hover:scale-125"
                    } ${isPast ? "opacity-60" : ""} ${isCurrent ? "ring-4 ring-yellow-400 animate-pulse" : ""}`}
                    aria-label={event.event}
                  />

                  {/* Fecha */}
                  <div className="mt-3 text-center">
                    <p className="font-body text-xs font-bold text-subtitle">
                      {formatDate(event.date)}
                    </p>
                  </div>

                  {/* Indicador "Te encuentras aquí" */}
                  {isCurrent && (
                    <div className="mt-2">
                      <div className="bg-button-background-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse whitespace-nowrap">
                        📍 Te encuentras aquí
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden space-y-4">
          {timelineEvents.map((event, index) => {
            const colors = getCategoryColor(event.category);
            const isSelected = selectedEvent === index;
            const isPast = event.status === "past";
            const isCurrent = index === currentEventIndex;

            return (
              <div key={index} className="relative">
                <button
                  onClick={() => setSelectedEvent(isSelected ? null : index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                    isSelected
                      ? `${colors.bg} border-button-background-primary shadow-lg`
                      : `border-subtitle/30 hover:border-button-background-primary/50 ${isPast ? "opacity-60" : ""}`
                  } ${isCurrent ? "ring-2 ring-yellow-400" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">
                      {getCategoryIcon(event.category)}
                    </span>
                    <div className="flex-1">
                      <p className="font-body text-xs font-semibold text-subtitle/70">
                        {formatDate(event.date)}
                      </p>
                      <p className="font-title text-base font-bold text-subtitle mt-1">
                        {event.event}
                      </p>
                      {isSelected && (
                        <p className="font-body text-sm mt-2 text-subtitle/80">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-xs ${colors.dot} w-3 h-3 rounded-full flex-shrink-0 mt-2`}
                    ></span>
                  </div>
                </button>
                {isCurrent && (
                  <div className="mt-2 flex justify-center">
                    <div className="bg-button-background-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      📍 Te encuentras aquí
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Panel de información (Desktop) */}
        {selectedEvent !== null && (
          <div className="hidden md:block mt-8 p-6 rounded-xl border-2 border-button-background-primary bg-white shadow-xl animate-fade-in">
            <div className="flex items-start gap-4">
              <span className="text-4xl">
                {getCategoryIcon(timelineEvents[selectedEvent].category)}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-title text-xl font-bold text-subtitle">
                    {timelineEvents[selectedEvent].event}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      getCategoryColor(timelineEvents[selectedEvent].category)
                        .bg
                    } ${getCategoryColor(timelineEvents[selectedEvent].category).text}`}
                  >
                    {formatDate(timelineEvents[selectedEvent].date)}
                  </span>
                </div>
                <p className="font-body text-base leading-relaxed">
                  {timelineEvents[selectedEvent].description}
                </p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-subtitle/50 hover:text-subtitle text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Leyenda de categorías */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs">
          {[
            { key: "legal", label: "Legal" },
            { key: "voting", label: "Votación" },
            { key: "registration", label: "Inscripción" },
            { key: "transparency", label: "Transparencia" },
            { key: "logistics", label: "Logística" },
            { key: "debate", label: "Debates" },
          ].map(({ key, label }) => {
            const colors = getCategoryColor(key);
            return (
              <div key={key} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${colors.dot}`}></span>
                <span className="font-body">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
