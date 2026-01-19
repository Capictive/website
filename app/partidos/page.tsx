"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import Nav from "../components/Nav";
import { PARTIES, Party, PartyDetail, Problema, Eje, Escandalo } from "../lib/parties";

const flagMap: Record<string, string> = {
  // --- NORTEAMÉRICA ---
  "CAN": "🇨🇦",
  "USA": "🇺🇸",
  "MEX": "🇲🇽",

  // --- CENTROAMÉRICA Y CARIBE ---
  "CRI": "🇨🇷",
  "CUB": "🇨🇺",
  "DOM": "🇩🇴",
  "SLV": "🇸🇻",
  "GTM": "🇬🇹",
  "HND": "🇭🇳",
  "NIC": "🇳🇮",
  "PAN": "🇵🇦",
  "PRI": "🇵🇷",
  "HTI": "🇭🇹",
  "JAM": "🇯🇲",

  // --- SUDAMÉRICA (LATAM) ---
  "ARG": "🇦🇷",
  "BOL": "🇧🇴",
  "BRA": "🇧🇷",
  "CHL": "🇨🇱",
  "COL": "🇨🇴",
  "ECU": "🇪🇨",
  "PRY": "🇵🇾",
  "PER": "🇵🇪",
  "URY": "🇺🇾",
  "VEN": "🇻🇪",

  // --- EUROPA ---
  "ALB": "🇦🇱",
  "AND": "🇦🇩",
  "AUT": "🇦🇹",
  "BEL": "🇧🇪",
  "BGR": "🇧🇬",
  "HRV": "🇭🇷",
  "CYP": "🇨🇾",
  "CZE": "🇨🇿",
  "DNK": "🇩🇰",
  "EST": "🇪🇪",
  "FIN": "🇫🇮",
  "FRA": "🇫🇷",
  "DEU": "🇩🇪",
  "GRC": "🇬🇷",
  "HUN": "🇭🇺",
  "ISL": "🇮🇸",
  "IRL": "🇮🇪",
  "ITA": "🇮🇹",
  "LVA": "🇱🇻",
  "LIE": "🇱🇮",
  "LTU": "🇱🇹",
  "LUX": "🇱🇺",
  "MLT": "🇲🇹",
  "MCO": "🇲🇨",
  "MNE": "🇲🇪",
  "NLD": "🇳🇱",
  "NOR": "🇳🇴",
  "POL": "🇵🇱",
  "PRT": "🇵🇹",
  "ROU": "🇷🇴",
  "RUS": "🇷🇺",
  "SRB": "🇷🇸",
  "SVK": "🇸🇰",
  "SVN": "🇸🇮",
  "ESP": "🇪🇸",
  "SWE": "🇸🇪",
  "CHE": "🇨🇭",
  "UKR": "🇺🇦",
  "GBR": "🇬🇧",
  "VAT": "🇻🇦",

  // --- ASIA / OCEANÍA ---
  "AUS": "🇦🇺",
  "CHN": "🇨🇳",
  "HKG": "🇭🇰",
  "IND": "🇮🇳",
  "JPN": "🇯🇵",
  "NZL": "🇳🇿",
  "KOR": "🇰🇷",
  "SGP": "🇸🇬",
  "THA": "🇹🇭",
  "TUR": "🇹🇷",
  "ISR": "🇮🇱",
  "ARE": "🇦🇪",
};

// Mapeo de imágenes para cada paso del tour
const TOUR_IMAGES: Record<number, string> = {
  0: "/pose/searching.png",  // Bienvenida
  1: "/pose/reading.png",    // Buscador
  2: "/pose/giveme.png",     // Lista partidos
  3: "/pose/reading.png",    // Detalle partido
  4: "/pose/searching.png",  // Documentos
  5: "/pose/sending.png",    // Ejes/Problemas
  6: "/pose/lost.png",       // Final
};

// Mapeo de audios para cada paso del tour
const TOUR_AUDIOS: Record<number, string> = {
  0: "/audios/partidos/1.mp3",
  1: "/audios/partidos/2.mp3",
  2: "/audios/partidos/3.mp3",
  3: "/audios/partidos/4.mp3",
  4: "/audios/partidos/5.mp3",
  5: "/audios/partidos/6.mp3",
  6: "/audios/partidos/7.mp3",
};

// Pasos del tour
const TOUR_STEPS: Step[] = [
  {
    target: "body",
    content: "¡Bienvenido a la sección de Partidos Políticos! Aquí podrás explorar las propuestas de cada partido de manera simple. 🗳️",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: ".tour-buscador",
    content: "Usa el buscador para filtrar partidos por nombre rápidamente.",
    placement: "bottom",
  },
  {
    target: ".tour-lista-partidos",
    content: "Aquí aparecen los partidos políticos. Haz clic en cualquiera para ver sus propuestas detalladas.",
    placement: "right",
  },
  {
    target: ".tour-detalle-partido",
    content: "En esta sección verás toda la información del partido: candidatos, visión y propuestas.",
    placement: "left",
  },
  {
    target: ".tour-documentos",
    content: "Descarga el Plan Resumen o el Plan de Gobierno completo en PDF para más detalles.",
    placement: "bottom",
  },
  {
    target: ".tour-toggle-ejes",
    content: "Alterna entre Ejes Principales (propuestas por tema) y Problemas Identificados (diagnóstico del partido).",
    placement: "top",
  },
  {
    target: "body",
    content: "¡Eso es todo! Explora los partidos y toma una decisión informada. 🎯",
    placement: "center",
  },
];

// Componente de tooltip personalizado para Joyride
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
  isLastStep 
}: CustomTooltipProps) => (
  <div 
    {...tooltipProps}
    className="bg-white rounded-2xl shadow-2xl p-0 max-w-sm overflow-hidden"
  >
    {/* Imagen del paso */}
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
    
    {/* Contenido */}
    <div className="p-5">
      {step.title && (
        <h3 className="font-title text-subtitle text-lg font-bold mb-2">
          {step.title}
        </h3>
      )}
      <p className="font-body text-subtitle/80 text-sm leading-relaxed">
        {step.content}
      </p>
      
      {/* Indicador de progreso */}
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
      
      {/* Botones */}
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
              {isLastStep ? "¡Listo!" : "Siguiente"}
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

async function fetchPartyDetail(partyName: string): Promise<PartyDetail | null> {
  try {
    const encodedName = encodeURIComponent(partyName);
    const res = await fetch(`https://api.capictive.app/?id=${encodedName}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching party detail:", error);
    return null;
  }
}

async function fetchPartyScandals(partyName: string): Promise<Escandalo[] | null> {
  try {
    const encodedName = encodeURIComponent(partyName);
    const res = await fetch(`https://controver.capictive.app?partido=${encodedName}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.escandalos || [];
  } catch (error) {
    console.error("Error fetching party scandals:", error);
    return null;
  }
}

export default function PartidosPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Party | null>(null);
  const [detailState, setDetailState] = useState<{detail: PartyDetail | null, loading: boolean}>({detail: null, loading: false});
  const [scandalsState, setScandalsState] = useState<{scandals: Escandalo[] | null, loading: boolean}>({scandals: null, loading: false});
  const [currentEjeIndex, setCurrentEjeIndex] = useState(0);
  const [currentProblemaIndex, setCurrentProblemaIndex] = useState(0);
  const [currentEscandaloIndex, setCurrentEscandaloIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'ejes' | 'problemas' | 'escandalos'>('ejes');
  const [blockedParties, setBlockedParties] = useState<string[]>([]);
  
  // Estado para el modal de bloqueo
  const [partyToBlock, setPartyToBlock] = useState<string | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);

  const detailArticleRef = useRef<HTMLElement>(null);

  // Cargar partidos bloqueados
  useEffect(() => {
    const stored = localStorage.getItem("blocked-parties");
    if (stored) {
      try {
        setBlockedParties(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing blocked parties", e);
      }
    }
  }, []);

  // Función para iniciar el bloqueo
  const initiateBlockParty = (e: React.MouseEvent, partyName: string) => {
    e.stopPropagation(); // Evitar seleccionar el partido
    setPartyToBlock(partyName);
    setShowBlockModal(true);
  };

  // Confirmar bloqueo
  const confirmBlockParty = () => {
    if (partyToBlock) {
      const newBlocked = [...blockedParties, partyToBlock];
      setBlockedParties(newBlocked);
      localStorage.setItem("blocked-parties", JSON.stringify(newBlocked));
      
      // Si el partido bloqueado estaba seleccionado, deseleccionar
      if (selected?.name === partyToBlock) {
        setSelected(null);
      }
      
      closeBlockModal();
    }
  };

  // Cerrar modal
  const closeBlockModal = () => {
    setPartyToBlock(null);
    setShowBlockModal(false);
  };


  // Estado del tour
  const [runTour, setRunTour] = useState<boolean>(false);
  const [tourCompleted, setTourCompleted] = useState<boolean>(false);
  
  // Ref para el audio del tour
  const tourAudioRef = useRef<HTMLAudioElement | null>(null);

  // Función para reproducir audio del tour
  const playTourAudio = useCallback((stepIndex: number) => {
    // Detener audio anterior si existe
    if (tourAudioRef.current) {
      tourAudioRef.current.pause();
      tourAudioRef.current.currentTime = 0;
    }
    
    const audioSrc = TOUR_AUDIOS[stepIndex];
    if (audioSrc) {
      tourAudioRef.current = new Audio(audioSrc);
      tourAudioRef.current.volume = 0.7;
      tourAudioRef.current.play().catch(err => console.log("Audio autoplay blocked:", err));
    }
  }, []);

  // Detener audio cuando se cierra el tour
  const stopTourAudio = useCallback(() => {
    if (tourAudioRef.current) {
      tourAudioRef.current.pause();
      tourAudioRef.current.currentTime = 0;
      tourAudioRef.current = null;
    }
  }, []);

  // Verificar si es la primera visita
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("partidos-tour-completed");
    if (!hasSeenTour) {
      const timer = setTimeout(() => setRunTour(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setTourCompleted(true);
    }
  }, []);

  // Callback del tour
  const handleTourCallback = (data: CallBackProps) => {
    const { status, index, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    // Reproducir audio cuando cambia el paso
    if (type === "step:after" || type === "tour:start") {
      const nextIndex = type === "tour:start" ? 0 : index + 1;
      if (nextIndex < TOUR_STEPS.length) {
        playTourAudio(nextIndex);
      }
    }
    
    // Reproducir audio del primer paso al iniciar
    if (type === "tour:start") {
      playTourAudio(0);
    }
    
    // Cuando llegamos al paso de la lista de partidos (index 2), seleccionar automáticamente el primer partido
    if (type === "step:before" && index === 2 && !selected) {
      setSelected(PARTIES[0]);
    }
    
    if (finishedStatuses.includes(status)) {
      stopTourAudio();
      setRunTour(false);
      setTourCompleted(true);
      localStorage.setItem("partidos-tour-completed", "true");
    }
  };

  // Reiniciar tour
  const restartTour = () => {
    setRunTour(true);
  };

  const handlePartySelect = (party: Party) => {
    setSelected(party);
    // En móvil, hacer scroll hacia el detalle del partido
    if (window.innerWidth < 768 && detailArticleRef.current) {
      setTimeout(() => {
        detailArticleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const perPage = 5;
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return PARTIES.filter((p) => p.name.toLowerCase().includes(q) && !blockedParties.includes(p.name));
  }, [query, blockedParties]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(safePage * perPage, safePage * perPage + perPage);

  useEffect(() => {
    if (selected) {
      setDetailState({detail: null, loading: true});
      setScandalsState({scandals: null, loading: true});
      setCurrentEjeIndex(0);
      setCurrentProblemaIndex(0);
      setCurrentEscandaloIndex(0);
      setViewMode('ejes');
      fetchPartyDetail(selected.name).then((data) => setDetailState({detail: data, loading: false}));
      fetchPartyScandals(selected.name).then((data) => setScandalsState({scandals: data, loading: false}));
    } else {
      setDetailState({detail: null, loading: false});
      setScandalsState({scandals: null, loading: false});
      setCurrentEjeIndex(0);
      setCurrentProblemaIndex(0);
      setCurrentEscandaloIndex(0);
    }
  }, [selected]);

  return (
    <main>
      {/* Tour guiado */}
      <Joyride
        steps={TOUR_STEPS}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        callback={handleTourCallback}
        tooltipComponent={CustomTooltip}
        floaterProps={{
          styles: {
            arrow: {
              color: "#fff",
            },
          },
        }}
        styles={{
          options: {
            overlayColor: "rgba(80, 50, 36, 0.5)",
            zIndex: 10000,
          },
        }}
      />

      <Nav />

      {/* Botones discretos de apoyo y compartir */}
      <div className="flex justify-between py-3">
        <a
          href="https://wa.me/?text=%C2%A1Mira%20esta%20p%C3%A1gina%20para%20informarte%20sobre%20las%20elecciones%202026%21%20%F0%9F%97%B3%EF%B8%8F%20https%3A%2F%2Fcapictive.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-body underline p-1 hover:bg-transparent text-subtitle hover:text-green-600 transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Compartir
        </a>
        <a
          href="/apoyar"
          className="text-sm font-body text-subtitle font-bold hover:text-button-background-primary transition-colors flex items-center gap-1"
        >
          ❤️ Apoyar la página
        </a>
      </div>

      {/* Encabezado periódico */}
      <div className="py-8 border-y text-center border-subtitle">
        <h1 className="font-title text-subtitle text-4xl sm:text-5xl md:text-6xl font-extrabold">Partidos Políticos</h1>
        <p className="font-body">Explora y compara propuestas de manera simple</p>
        {/* Botón para reiniciar tour */}
        {tourCompleted && (
          <button
            onClick={restartTour}
            className="mt-2 text-xs font-body text-button-background-primary hover:underline"
          >
            🎯 Ver tutorial nuevamente
          </button>
        )}
      </div>

      {/* Grid principal: lista + detalle */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Lista y filtros */}
        <aside className="tour-lista-partidos col-span-1 space-y-4">
          <div className="tour-buscador flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => {
                setPage(0);
                setQuery(e.target.value);
              }}
              placeholder="Filtrar partidos..."
              className="w-full px-3 py-2 rounded-md border border-subtitle font-body text-subtitle bg-button-background-secondary/30"
            />
          </div>

          {/* Navegación por páginas */}
          <div className="flex items-center justify-between mt-2">
            <button
              className="btn-secondary"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              aria-label="Anterior"
            >
              ←
            </button>
            <span className="font-body text-sm">Página {safePage + 1} de {totalPages}</span>
            <button
              className="btn-secondary"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              aria-label="Siguiente"
            >
              →
            </button>
          </div>

          {/* Lista vertical de 5 */}
          <div className="mt-3">
            <div className="grid grid-cols-1 gap-3">
              {visible.map((p) => (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  className={`card rounded-md border-2 w-full text-left transition-all duration-200 cursor-pointer flex items-center justify-between pr-2 ${
                    selected?.id === p.id 
                      ? "border-button-background-primary bg-button-background-primary/10 shadow-lg scale-105 ring-2 ring-button-background-primary/30" 
                      : "border-subtitle hover:border-button-background-primary/50 hover:shadow-md"
                  }`}
                  onClick={() => handlePartySelect(p)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handlePartySelect(p);
                    }
                  }}
                >
                  <div className="flex items-center gap-3 p-3 flex-1">
                    <Image src={p.logo} alt={p.name} width={48} height={48} />
                    <span className={`font-body ${
                      selected?.id === p.id ? "text-button-background-primary font-bold" : "text-subtitle"
                    }`}>{p.name}</span>
                  </div>

                  {/* Botón de bloquear */}
                  <button
                    onClick={(e) => initiateBlockParty(e, p.name)}
                    className="p-2 text-subtitle/40 hover:text-button-background-primary hover:bg-button-background-secondary/50 rounded-full transition-colors"
                    title="Bloquear partido (No ver más)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Detalle del partido seleccionado */}
        <article ref={detailArticleRef} className="tour-detalle-partido col-span-2 border rounded-md border-subtitle p-6 space-y-6">
          {!selected ? (
            /* Placeholder cuando no hay partido seleccionado */
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-6">
              <Image
                src="/pose/searching.png"
                alt="Selecciona un partido"
                width={180}
                height={180}
                className="opacity-80"
              />
              <div className="space-y-2">
                <h3 className="font-title text-subtitle text-2xl font-bold">
                  ¡Selecciona un partido político!
                </h3>
                <p className="font-body text-subtitle/70 max-w-md">
                  Haz clic en cualquier partido de la lista de la izquierda para ver sus propuestas, candidatos y plan de gobierno.
                </p>
              </div>
              <div className="flex items-center gap-2 text-button-background-primary">
                <span className="text-2xl">👈</span>
                <span className="font-body text-sm">Elige de la lista</span>
              </div>
            </div>
          ) : detailState.loading ? (
            <p className="font-body">Cargando detalles...</p>
          ) : detailState.detail ? (
              <div className="space-y-6">
                {/* Encabezado centrado con logo y candidato */}
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="flex flex-col items-center">
                    <Image src={selected.logo} alt={selected.name} width={120} height={120} />
                    {/* Imagen del candidato con nombre superpuesto */}
                    <div className="relative mt-4">
                      <Image
                        src={detailState.detail.presidente_links[0] || selected.candidateImage}
                        alt={`Candidato ${selected.name}`}
                        width={240}
                        height={240}
                        className="rounded-md border border-subtitle object-cover aspect-square w-full max-w-[240px]"
                      />
                      {/* Nombre del presidente superpuesto */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-black/5 p-3 rounded-b-md">
                        <p className="font-title text-white text-sm font-bold text-center leading-tight">
                          {selected.candidatos.presidente}
                        </p>
                        <p className="font-body text-white/80 text-xs text-center">
                          Candidato Presidencial
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3 text-center md:text-left">
                    <h2 className="font-title text-subtitle text-4xl font-bold">{detailState.detail.partido}</h2>
                    <p className="font-body italic text-lg">&ldquo;{detailState.detail.slogan_detectado}&rdquo;</p>
                    <p className="font-body text-sm md:text-base">{detailState.detail.vision_resumen}</p>
                    
                    {/* Vicepresidentes */}
                    <div className="bg-button-background-secondary/30 rounded-lg p-4 space-y-2">
                      <p className="font-body text-xs uppercase font-bold text-subtitle/70 tracking-wide">Fórmula Presidencial</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🥇</span>
                          <div>
                            <p className="font-body text-xs text-subtitle/70">1er Vicepresidente</p>
                            <p className="font-body text-sm font-semibold text-subtitle">{selected.candidatos.primer_vicepresidente}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🥈</span>
                          <div>
                            <p className="font-body text-xs text-subtitle/70">2do Vicepresidente</p>
                            <p className="font-body text-sm font-semibold text-subtitle">{selected.candidatos.segundo_vicepresidente}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="tour-documentos flex flex-wrap gap-3 font-body justify-center md:justify-start">
                      <a href={`https://files.capictive.app/Partidos%20Politicos/${encodeURIComponent(detailState.detail.partido)}/PLAN%20RESUMEN.pdf`} target="_blank" className="btn-primary text-sm">📄 Plan Resumen</a>
                      <a href={`https://files.capictive.app/Partidos%20Politicos/${encodeURIComponent(detailState.detail.partido)}/PLAN%20GOBIERNO.pdf`} target="_blank" className="btn-secondary text-sm">📑 Plan Gobierno</a>
                      <a href={`https://files.capictive.app/Partidos%20Politicos/${encodeURIComponent(detailState.detail.partido)}/HOJA%20DE%20CANDIDATOS.pdf`} target="_blank" className="btn-secondary text-sm">👥 Hoja de Candidatos</a>
                      <Link 
                        href={`/entrevistas?partido=${encodeURIComponent(detailState.detail.partido)}`}
                        className="btn-secondary text-sm flex items-center gap-1"
                      >
                        🎥 Ver Entrevistas
                      </Link>
                      <button className="btn-secondary text-sm opacity-60 cursor-not-allowed" disabled>⚖️ Comparar - Próximamente</button>
                    </div>
                  </div>
                </div>
                 {/* Toggle: Ejes / Problemas */}
                <div className="space-y-4">
                  {/* Toggle buttons */}
                  <div className="tour-toggle-ejes flex flex-col sm:flex-row items-stretch justify-center gap-2 bg-button-background-secondary/20 rounded-lg p-1 border-2 border-subtitle/30">
                    <button
                      onClick={() => setViewMode('ejes')}
                      className={`flex-1 py-2 px-2 rounded-md font-body text-sm font-semibold transition-all border-2 ${
                        viewMode === 'ejes' 
                          ? 'bg-button-background-primary text-white shadow-md border-button-background-primary' 
                          : 'text-subtitle hover:bg-button-background-secondary/30 border-transparent'
                      }`}
                    >
                      📋 Ejes Principales
                    </button>
                    <button
                      onClick={() => setViewMode('problemas')}
                      className={`flex-1 py-2 px-2 rounded-md font-body text-sm font-semibold transition-all border-2 ${
                        viewMode === 'problemas' 
                          ? 'bg-button-background-primary text-white shadow-md border-button-background-primary' 
                          : 'text-subtitle hover:bg-button-background-secondary/30 border-transparent'
                      }`}
                    >
                      ⚠️ Problemas
                    </button>
                    <button
                      onClick={() => setViewMode('escandalos')}
                      className={`flex-1 py-2 px-2 rounded-md font-body text-sm font-semibold transition-all border-2 ${
                        viewMode === 'escandalos' 
                          ? 'bg-button-background-primary text-white shadow-md border-button-background-primary' 
                          : 'text-subtitle hover:bg-red-50 border-transparent hover:text-red-700'
                      }`}
                    >
                      🚨 Escándalos
                    </button>
                  </div>
                  
                  {viewMode === 'ejes' ? (
                    <>
                      {/* Mobile: Swipeable cards */}
                      <div className="md:hidden">
                        <EjesSwipeable 
                          ejes={detailState.detail.ejes} 
                          currentIndex={currentEjeIndex}
                          setCurrentIndex={setCurrentEjeIndex}
                          flagMap={flagMap}
                        />
                      </div>

                      {/* Desktop: Normal view with buttons */}
                      <div className="hidden md:block">
                        <div className="flex items-center gap-4">
                          <button
                            className="btn-secondary text-2xl flex-shrink-0 disabled:opacity-40"
                            onClick={() => setCurrentEjeIndex((i) => Math.max(0, i - 1))}
                            disabled={currentEjeIndex === 0}
                          >
                            ‹
                          </button>
                          <div className="flex-1">
                            {detailState.detail.ejes.length > 0 && (
                              <EjeCard eje={detailState.detail.ejes[currentEjeIndex]} flagMap={flagMap} />
                            )}
                          </div>
                          <button
                            className="btn-secondary text-2xl flex-shrink-0 disabled:opacity-40"
                            onClick={() => setCurrentEjeIndex((i) => Math.min(detailState.detail!.ejes.length - 1, i + 1))}
                            disabled={currentEjeIndex === detailState.detail!.ejes.length - 1}
                          >
                            ›
                          </button>
                        </div>
                        <p className="text-center font-body text-sm mt-3">{currentEjeIndex + 1} de {detailState.detail.ejes.length}</p>
                      </div>
                    </>
                  ) : viewMode === 'problemas' ? (
                    <>
                      {detailState.detail.problemas && detailState.detail.problemas.length > 0 ? (
                        <>
                          {/* Mobile: Swipeable problema cards */}
                          <div className="md:hidden">
                            <ProblemasSwipeable 
                              problemas={detailState.detail.problemas} 
                              currentIndex={currentProblemaIndex}
                              setCurrentIndex={setCurrentProblemaIndex}
                            />
                          </div>

                          {/* Desktop: Normal view with buttons */}
                          <div className="hidden md:block">
                            <div className="flex items-center gap-4">
                              <button
                                className="btn-secondary text-2xl flex-shrink-0 disabled:opacity-40"
                                onClick={() => setCurrentProblemaIndex((i) => Math.max(0, i - 1))}
                                disabled={currentProblemaIndex === 0}
                              >
                                ‹
                              </button>
                              <div className="flex-1">
                                <ProblemaCard problema={detailState.detail.problemas[currentProblemaIndex]} />
                              </div>
                              <button
                                className="btn-secondary text-2xl flex-shrink-0 disabled:opacity-40"
                                onClick={() => setCurrentProblemaIndex((i) => Math.min(detailState.detail!.problemas!.length - 1, i + 1))}
                                disabled={currentProblemaIndex === detailState.detail!.problemas!.length - 1}
                              >
                                ›
                              </button>
                            </div>
                            <p className="text-center font-body text-sm mt-3">{currentProblemaIndex + 1} de {detailState.detail.problemas.length}</p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 border rounded-xl bg-gray-50">
                          <span className="text-4xl mb-2 block">📭</span>
                          <p className="font-body text-subtitle">No hay problemas identificados para este partido.</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                       {scandalsState.loading ? (
                          <div className="text-center py-12">
                             <div className="inline-block animate-spin text-4xl mb-2">🔄</div>
                             <p className="font-body text-subtitle">Investigando escándalos...</p>
                          </div>
                       ) : scandalsState.scandals && scandalsState.scandals.length > 0 ? (
                          <>
                             {/* Mobile Swipeable */}
                             <div className="md:hidden">
                                <EscandalosSwipeable 
                                   escandalos={scandalsState.scandals}
                                   currentIndex={currentEscandaloIndex}
                                   setCurrentIndex={setCurrentEscandaloIndex}
                                />
                             </div>
                             {/* Desktop */}
                             <div className="hidden md:block">
                                <div className="flex items-center gap-4">
                                  <button
                                    className="btn-secondary text-2xl flex-shrink-0 disabled:opacity-40"
                                    onClick={() => setCurrentEscandaloIndex((i) => Math.max(0, i - 1))}
                                    disabled={currentEscandaloIndex === 0}
                                  >
                                    ‹
                                  </button>
                                  <div className="flex-1">
                                    <EscandaloCard escandalo={scandalsState.scandals[currentEscandaloIndex]} />
                                  </div>
                                  <button
                                    className="btn-secondary text-2xl flex-shrink-0 disabled:opacity-40"
                                    onClick={() => setCurrentEscandaloIndex((i) => Math.min(scandalsState.scandals!.length - 1, i + 1))}
                                    disabled={currentEscandaloIndex === scandalsState.scandals.length - 1}
                                  >
                                    ›
                                  </button>
                                </div>
                                <p className="text-center font-body text-sm mt-3">{currentEscandaloIndex + 1} de {scandalsState.scandals.length}</p>
                             </div>
                          </>
                       ) : (
                          <div className="text-center py-8 border rounded-xl bg-green-50">
                             <span className="text-4xl mb-2 block">✅</span>
                             <p className="font-body text-subtitle">No se han registrado escándalos mayores o no hay información disponible.</p>
                          </div>
                       )}
                    </>
                  )}
                </div>

                {/* Lo que no dicen */}
                <div className="border-t pt-4">
                  <h3 className="font-title text-subtitle text-xl font-bold">Lo que no dicen</h3>
                  <p className="font-body">{detailState.detail.lo_que_no_dicen}</p>
                </div>

                {/* Fuentes */}
                <div className="border-t pt-4">
                  <h3 className="font-title text-subtitle text-lg font-bold">Fuentes Consultadas</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {detailState.detail.fuentes_consultadas.map((fuente: string, i: number) => (
                      <li key={i} className="font-body text-sm">{fuente}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="font-body">No se pudieron cargar los detalles del partido.</p>
            )
          }
        </article>
      </section>
      {/* Modal de confirmación de bloqueo */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-subtitle/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-primary-background rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn border-2 border-subtitle">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-button-background-secondary rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-button-background-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold font-title text-title">
                ¿Bloquear a {partyToBlock}?
              </h3>
              
              <p className="text-subtitle font-body text-sm">
                Al confirmar, este partido desaparecerá de tu lista.
                <br />
                <span className="text-xs opacity-70 mt-2 block">(Podrás desbloquearlo borrando tus datos de navegación si cambias de opinión)</span>
              </p>

              <div className="flex gap-3 w-full mt-4">
                <button
                  onClick={closeBlockModal}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmBlockParty}
                  className="flex-1 btn-primary"
                >
                  Bloquear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Component for individual Eje Card

function EjeCard({ eje, flagMap }: { eje: Eje; flagMap: Record<string, string> }) {
  return (
    <div className="border rounded-xl p-4 md:p-5 space-y-3 shadow-lg bg-white">
      {/* Category Header */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">
          {eje.categoria.includes('SEGURIDAD') ? '🛡️' :
           eje.categoria.includes('INFRAESTRUCTURA') ? '🏗️' :
           eje.categoria.includes('ECONOMÍA') ? '💰' :
           eje.categoria.includes('GESTIÓN') ? '🏛️' :
           eje.categoria.includes('EDUCACIÓN') ? '📚' :
           eje.categoria.includes('SALUD') ? '🏥' : '📋'}
        </span>
        <h4 className="font-title text-subtitle text-lg md:text-xl font-semibold">{eje.categoria}</h4>
      </div>
      
      {/* Main Proposal */}
      <div className="bg-button-background-primary/10 p-3 rounded-lg border-l-4 border-button-background-primary">
        <p className="font-body font-bold text-subtitle text-sm md:text-base">{eje.propuesta_estrella}</p>
      </div>
      
      {/* What they propose */}
      <div className="space-y-2">
        <p className="font-body font-semibold text-xs uppercase text-gray-500">Qué proponen:</p>
        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {eje.que_proponen.map((propuesta: string, i: number) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-green-500 text-sm flex-shrink-0 mt-0.5">✔</span>
              <span className="font-body text-xs md:text-sm">{propuesta}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Collapsible sections for mobile */}
      <details className="group">
        <summary className="font-body text-sm font-semibold cursor-pointer list-none flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
          <span>💡</span> Dato curioso
          <span className="ml-auto group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p className="font-body text-xs md:text-sm italic mt-2 p-2 bg-gray-50 rounded">{eje.dato_curioso}</p>
      </details>
      
      <details className="group">
        <summary className="font-body text-sm font-semibold cursor-pointer list-none flex items-center gap-2 bg-yellow-100 p-2 rounded-lg">
          <span>🤔</span> Para reflexionar
          <span className="ml-auto group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p className="font-body text-xs md:text-sm mt-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-500">{eje.para_reflexionar}</p>
      </details>
      
      {/* Benchmark Internacional */}
      <details className="group" open>
        <summary className="font-body text-sm font-semibold cursor-pointer list-none flex items-center gap-2 bg-blue-100 p-2 rounded-lg">
          <span>🌍</span> Caso Internacional
          <span className="ml-auto group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="mt-2 border rounded-lg p-3 bg-white shadow-sm relative">
          <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${
            eje.benchmark_internacional.nivel_similitud === 'ALTO' ? 'bg-green-500 text-white' :
            eje.benchmark_internacional.nivel_similitud === 'MEDIO' ? 'bg-yellow-500 text-black' :
            'bg-red-500 text-white'
          }`}>
            {eje.benchmark_internacional.nivel_similitud}
          </div>
          <div className="flex items-center gap-2 mb-2 pr-16">
            <span className="text-3xl">{flagMap[eje.benchmark_internacional.codigo_pais] || "🏛️"}</span>
            <div>
              <p className="font-body text-xs md:text-sm font-bold text-subtitle">{eje.benchmark_internacional.caso_similar}</p>
              <p className="font-body text-xs text-gray-600">({eje.benchmark_internacional.codigo_pais})</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-sm">📝</span>
              <p className="font-body text-xs italic text-gray-700">{eje.benchmark_internacional.descripcion}</p>
            </div>
            <div className="flex items-start gap-2 bg-amber-50 p-2 rounded">
              <span className="text-sm">💡</span>
              <p className="font-body text-xs font-semibold text-amber-800">Lección: {eje.benchmark_internacional.leccion}</p>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}

// Swipeable component for mobile
function EjesSwipeable({ 
  ejes, 
  currentIndex, 
  setCurrentIndex, 
  flagMap 
}: { 
  ejes: Eje[]; 
  currentIndex: number; 
  setCurrentIndex: (fn: (i: number) => number) => void;
  flagMap: Record<string, string>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentIndex < ejes.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [touchStart, touchEnd, currentIndex, ejes.length, setCurrentIndex]);

  return (
    <div className="space-y-3">
      {/* Swipe instruction */}
      <p className="text-center font-body text-xs text-gray-500 flex items-center justify-center gap-1">
        <span>👆</span> Desliza para ver más ejes
      </p>
      
      {/* Card container with touch events */}
      <div 
        ref={containerRef}
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          <div className="flex">
            {ejes.map((eje, index) => (
              <div key={index} className="w-full flex-shrink-0 px-1">
                <EjeCard eje={eje} flagMap={flagMap} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center items-center gap-3">
        <button
          className="btn-secondary text-lg px-3 py-1 disabled:opacity-40"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
        >
          ‹
        </button>
        <div className="flex gap-2">
          {ejes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(() => index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-button-background-primary w-6' 
                  : 'bg-button-background-secondary'
              }`}
            />
          ))}
        </div>
        <button
          className="btn-secondary text-lg px-3 py-1 disabled:opacity-40"
          onClick={() => setCurrentIndex((i) => Math.min(ejes.length - 1, i + 1))}
          disabled={currentIndex === ejes.length - 1}
        >
          ›
        </button>
      </div>
      
      {/* Current position text */}
      <p className="text-center font-body text-sm text-subtitle">
        {currentIndex + 1} de {ejes.length}
      </p>
    </div>
  );
}

// Component for individual Problema Card
function ProblemaCard({ problema }: { problema: Problema }) {
  return (
    <div className="border rounded-xl p-4 md:p-5 space-y-4 shadow-lg bg-white">
      {/* Title Header */}
      <div className="flex items-start gap-3">
        <span className="text-3xl">⚠️</span>
        <div className="flex-1">
          <h4 className="font-title text-subtitle text-lg md:text-xl font-bold">{problema.titulo}</h4>
        </div>
      </div>
      
      {/* Resumen */}
      <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
        <p className="font-body text-xs uppercase font-bold text-red-700 mb-1">Resumen del problema</p>
        <p className="font-body text-sm text-subtitle">{problema.resumen}</p>
      </div>
      
      {/* Ejemplo */}
      <details className="group" open>
        <summary className="font-body text-sm font-semibold cursor-pointer list-none flex items-center gap-2 bg-orange-100 p-2 rounded-lg">
          <span>📋</span> Ejemplo concreto
          <span className="ml-auto group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p className="font-body text-xs md:text-sm mt-2 p-3 bg-orange-50 rounded border-l-4 border-orange-400 italic">{problema.ejemplo}</p>
      </details>
      
      {/* Solución */}
      <details className="group" open>
        <summary className="font-body text-sm font-semibold cursor-pointer list-none flex items-center gap-2 bg-green-100 p-2 rounded-lg">
          <span>💡</span> Solución propuesta
          <span className="ml-auto group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p className="font-body text-xs md:text-sm mt-2 p-3 bg-green-50 rounded border-l-4 border-green-500">{problema.solución}</p>
      </details>
      
      {/* Resolución de ejemplo */}
      <details className="group">
        <summary className="font-body text-sm font-semibold cursor-pointer list-none flex items-center gap-2 bg-blue-100 p-2 rounded-lg">
          <span>🎯</span> Cómo se resolvería
          <span className="ml-auto group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p className="font-body text-xs md:text-sm mt-2 p-3 bg-blue-50 rounded border-l-4 border-blue-500">{problema["resolución de ejemplo"]}</p>
      </details>
    </div>
  );
}

// Swipeable component for Problemas on mobile
function ProblemasSwipeable({ 
  problemas, 
  currentIndex, 
  setCurrentIndex 
}: { 
  problemas: Problema[]; 
  currentIndex: number; 
  setCurrentIndex: (fn: (i: number) => number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentIndex < problemas.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [touchStart, touchEnd, currentIndex, problemas.length, setCurrentIndex]);

  return (
    <div className="space-y-3">
      {/* Swipe instruction */}
      <p className="text-center font-body text-xs text-gray-500 flex items-center justify-center gap-1">
        <span>👆</span> Desliza para ver más problemas
      </p>
      
      {/* Card container with touch events */}
      <div 
        ref={containerRef}
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          <div className="flex">
            {problemas.map((problema, index) => (
              <div key={index} className="w-full flex-shrink-0 px-1">
                <ProblemaCard problema={problema} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center items-center gap-3">
        <button
          className="btn-secondary text-lg px-3 py-1 disabled:opacity-40"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
        >
          ‹
        </button>
        <div className="flex gap-2">
          {problemas.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(() => index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-button-background-primary w-6' 
                  : 'bg-button-background-secondary'
              }`}
            />
          ))}
        </div>
        <button
          className="btn-secondary text-lg px-3 py-1 disabled:opacity-40"
          onClick={() => setCurrentIndex((i) => Math.min(problemas.length - 1, i + 1))}
          disabled={currentIndex === problemas.length - 1}
        >
          ›
        </button>
      </div>
      
      {/* Current position text */}
      <p className="text-center font-body text-sm text-subtitle">
        {currentIndex + 1} de {problemas.length}
      </p>
    </div>
  );
}

// Component for individual Escandalo Card
function EscandaloCard({ escandalo }: { escandalo: Escandalo }) {
  return (
    <div className="border rounded-xl p-4 md:p-5 space-y-4 shadow-lg bg-white">
      {/* Title Header */}
      <div className="flex items-start gap-3">
        <span className="text-3xl">🚨</span>
        <div className="flex-1">
          <h4 className="font-title text-subtitle text-lg md:text-xl font-bold text-red-700">{escandalo.titulo}</h4>
        </div>
      </div>
      
      {/* Information */}
      <div className="bg-red-50/50 p-4 rounded-lg border-l-4 border-red-500">
        <p className="font-body text-sm text-subtitle leading-relaxed">{escandalo.información}</p>
      </div>
      
      {/* Involucrados */}
      {escandalo.involucrados && escandalo.involucrados.length > 0 && (
         <div className="space-y-2">
           <p className="font-body text-xs uppercase font-bold text-subtitle/70">Involucrados:</p>
           <div className="flex flex-wrap gap-2">
             {escandalo.involucrados.map((persona, i) => (
               <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs font-body font-medium text-gray-700 border border-gray-200">
                 👤 {persona}
               </span>
             ))}
           </div>
         </div>
      )}

      {/* Fuentes */}
      {escandalo.fuentes && escandalo.fuentes.length > 0 && (
        <details className="group">
          <summary className="font-body text-sm font-semibold cursor-pointer list-none flex items-center gap-2 text-subtitle hover:text-button-background-primary transition-colors">
            <span>🔗</span> Ver fuentes ({escandalo.fuentes.length})
            <span className="ml-auto group-open:rotate-180 transition-transform text-gray-400">▼</span>
          </summary>
          <div className="mt-2 space-y-2 p-2 bg-gray-50 rounded text-xs break-all">
            {escandalo.fuentes.map((fuente, i) => (
               <a key={i} href={fuente} target="_blank" rel="noopener noreferrer" className="block text-subtitle hover:underline hover:text-button-background-primary">
                 Link {i + 1}
               </a>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

// Swipeable component for Escandalos on mobile
function EscandalosSwipeable({ 
  escandalos, 
  currentIndex, 
  setCurrentIndex 
}: { 
  escandalos: Escandalo[]; 
  currentIndex: number; 
  setCurrentIndex: (fn: (i: number) => number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentIndex < escandalos.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [touchStart, touchEnd, currentIndex, escandalos.length, setCurrentIndex]);

  return (
    <div className="space-y-3">
      {/* Swipe instruction */}
      <p className="text-center font-body text-xs text-gray-500 flex items-center justify-center gap-1">
        <span>👆</span> Desliza para ver más escándalos
      </p>
      
      {/* Card container with touch events */}
      <div 
        ref={containerRef}
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          <div className="flex">
            {escandalos.map((escandalo, index) => (
              <div key={index} className="w-full flex-shrink-0 px-1">
                <EscandaloCard escandalo={escandalo} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center items-center gap-3">
        <button
          className="btn-secondary text-lg px-3 py-1 disabled:opacity-40"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
        >
          ‹
        </button>
        <div className="flex gap-2">
          {escandalos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(() => index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-button-background-primary w-6' 
                  : 'bg-button-background-secondary'
              }`}
            />
          ))}
        </div>
        <button
          className="btn-secondary text-lg px-3 py-1 disabled:opacity-40"
          onClick={() => setCurrentIndex((i) => Math.min(escandalos.length - 1, i + 1))}
          disabled={currentIndex === escandalos.length - 1}
        >
          ›
        </button>
      </div>
      
      {/* Current position text */}
      <p className="text-center font-body text-sm text-subtitle">
        {currentIndex + 1} de {escandalos.length}
      </p>
    </div>
  );
}
