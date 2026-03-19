"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Nav from "../components/Nav";
import { PARTIES } from "../lib/parties";
import dynamic from "next/dynamic";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

// Dynamic imports to avoid SSR issues with charts
const RadarValores = dynamic(
  () => import("../components/charts/RadarValores"),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);
const DiagramaNolan = dynamic(
  () => import("../components/charts/DiagramaNolan"),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);
const WordcloudChart = dynamic(
  () => import("../components/charts/WordcloudChart"),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl border-2 border-subtitle/10 p-8 flex items-center justify-center min-h-87.5">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-button-background-primary/30 border-t-button-background-primary rounded-full animate-spin mx-auto" />
        <p className="font-body text-sm text-subtitle/50">
          Cargando gráfico...
        </p>
      </div>
    </div>
  );
}

type Tab = "radar" | "nolan" | "wordcloud";

/* ─── Tour Steps ─── */
const TOUR_STEPS: Step[] = [
  {
    target: "body",
    content:
      "¡Bienvenido a la sección de Comparar Partidos! Aquí podrás analizar y comparar partidos usando gráficos interactivos. 🎉",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: ".tour-selector-partidos",
    content:
      "Primero agrega los partidos que quieras comparar. Puedes seleccionar varios al mismo tiempo y buscarlos por nombre.",
    placement: "bottom",
  },
  {
    target: ".tour-tabs",
    content:
      "Aquí cambias entre los 3 tipos de gráficos disponibles: Radar, Diagrama de Nolan y Nube de Palabras.",
    placement: "bottom",
  },
  {
    target: ".tour-tab-radar",
    content:
      "📊 El Radar de Valores muestra la posición ideológica de cada partido en diferentes ejes (economía, seguridad, medio ambiente, etc.). Mientras más grande el área, más énfasis pone el partido en ese tema.",
    placement: "bottom",
  },
  {
    target: ".tour-tab-nolan",
    content:
      "🧭 El Diagrama de Nolan ubica a cada partido en un plano de Libertad Económica vs Libertad Personal. Sirve para ver si un partido es más liberal, conservador, autoritario o libertario.",
    placement: "bottom",
  },
  {
    target: ".tour-tab-wordcloud",
    content:
      "☁️ La Nube de Palabras muestra los términos más usados en el plan de gobierno de un partido. Las palabras más grandes son las que más se repiten.",
    placement: "bottom",
  },
  {
    target: ".tour-chart-area",
    content:
      "El gráfico aparecerá aquí. Selecciona partidos arriba y explora cada pestaña para descubrir diferencias entre los partidos. ¡Compara y decide!",
    placement: "top",
  },
];

const TOUR_IMAGES: Record<number, string> = {
  0: "/pose/searching.png",
  1: "/pose/reading.png",
  2: "/pose/giveme.png",
  3: "/pose/reading.png",
  4: "/pose/searching.png",
  5: "/pose/reading.png",
  6: "/pose/sending.png",
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
              {isLastStep ? "¡Listo!" : "Siguiente"}
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Mapa de siglas a nombres de partidos
const PP_ALIAS_MAP: Record<string, string> = {
  AXLN: "Ahora Nación",
  RXAS: "Alianza Electoral Venceremos",
  FXMA: "Alianza Fuerza y Libertad",
  CXAP: "Alianza Para el Progreso",
  RXCL: "Alianza Unidad Nacional",
  JXWZ: "Avanza País",
  YXLA: "Cooperación Popular",
  AXLB: "Fe en el Perú",
  FXOV: "Frente de la Esperanza",
  KXFH: "Fuerza Popular",
  WXGC: "Integridad Democrática",
  RXSP: "Juntos por el Perú",
  RXBL: "Libertad Popular",
  EXVP: "Partido Aprista Peruano",
  RXBC: "Partido Cívico Obras",
  JXNM: "Partido del Buen Gobierno",
  AXMF: "Partido Democrático Federal",
  AXCG: "Partido Demócrata Verde",
  MXGA: "Partido Morado",
  HXCG: "Partido Patriótico del Perú",
  WXCP: "Partido Político PRIN",
  CXÁL: "País para todos",
  FXCT: "Perú Acción",
  VXCR: "Perú Libre",
  CXJC: "Perú Moderno",
  MXVC: "Perú Primero",
  JXLG: "Podemos Perú",
  MXDR: "Primero la Gente",
  PXJB: "Progresemos",
  RXLA: "Renovación Popular",
  AXOV: "Salvemos al Perú",
  CXEG: "SiCreo",
  GXFS: "Somos Perú",
  RXFB: "Un Camino Diferente",
};

function CompararContent() {
  const searchParams = useSearchParams();
  const initialParty = searchParams.get("partido") || "";
  const ppParams = searchParams.getAll("pp"); // Soporte para multiples ?pp=...&pp=...

  const [activeTab, setActiveTab] = useState<Tab>("radar");
  const [selectedParties, setSelectedParties] = useState<string[]>([]);
  const [wordcloudParty, setWordcloudParty] = useState<string>("");
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [blockedParties, setBlockedParties] = useState<string[]>([]);
  const [showNolanGuide, setShowNolanGuide] = useState(false);
  const [allyPopupState, setAllyPopupState] = useState<
    "hidden" | "visible" | "exiting"
  >("hidden");

  // JSON data
  const [radarData, setRadarData] = useState<unknown[]>([]);
  const [nolanData, setNolanData] = useState<unknown[]>([]);
  const [wordcloudData, setWordcloudData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  // Tour state
  const [runTour, setRunTour] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);

  // Cargar partidos bloqueados
  useEffect(() => {
    try {
      const raw = localStorage.getItem("blocked-parties");
      if (raw) setBlockedParties(JSON.parse(raw));
    } catch {
      /* empty */
    }
  }, []);

  useEffect(() => {
    const seen = localStorage.getItem("comparar-tour-completed");
    if (!seen) {
      const t = setTimeout(() => setRunTour(true), 800);
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
      localStorage.setItem("comparar-tour-completed", "true");
    }
  }, []);

  // Load data
  useEffect(() => {
    Promise.all([
      fetch("/data/radar.json").then((r) => r.json()),
      fetch("/data/nolan.json").then((r) => r.json()),
      fetch("/data/wordcloud.json").then((r) => r.json()),
    ])
      .then(([radar, nolan, wordcloud]) => {
        setRadarData(radar);
        setNolanData(nolan);
        setWordcloudData(wordcloud);
      })
      .finally(() => setLoading(false));
  }, []);

  //conset initial party from URL (only once on mount)
  useEffect(() => {
    const matches: string[] = [];

    // Manejar parametro heredado `partido=`
    if (initialParty) {
      const found = PARTIES.find(
        (p) => p.name.toLowerCase() === initialParty.toLowerCase(),
      );
      if (found) matches.push(found.name);
    }

    // Manejar multiples parametros `pp=` (ej: ?pp=AXLN&pp=VXCR)
    if (ppParams.length > 0) {
      ppParams.forEach((pp) => {
        const partyMatchName = PP_ALIAS_MAP[pp.toUpperCase()];
        if (partyMatchName) {
          const found = PARTIES.find((p) => p.name === partyMatchName);
          if (found && !matches.includes(found.name)) {
            matches.push(found.name);
          }
        }
      });

      // Mostrar el popup de aliado si se usaron los parametros 'pp'
      setAllyPopupState("visible");
      const t1 = setTimeout(() => setAllyPopupState("exiting"), 3000);
      const t2 = setTimeout(() => setAllyPopupState("hidden"), 3500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    if (matches.length > 0) {
      setSelectedParties((prev) => {
        const newParties = [...prev];
        matches.forEach((m) => {
          if (!newParties.includes(m)) newParties.push(m);
        });
        return newParties;
      });
      setWordcloudParty((prev) => prev || matches[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialParty, searchParams]); // `searchParams` incluido pues `ppParams` se deriva de él

  // Party name list from data that exists in radar/nolan

  const availableRadarParties = useMemo(
    () => radarData.map((d: any) => d.partido),
    [radarData],
  );

  const availableNolanParties = useMemo(
    () => nolanData.map((d: any) => d.nombre),
    [nolanData],
  );

  const availableWordcloudParties = useMemo(
    () => wordcloudData.map((d: any) => d.partido),
    [wordcloudData],
  );

  const filteredParties = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return PARTIES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) &&
        !selectedParties.includes(p.name) &&
        !blockedParties.includes(p.name),
    );
  }, [searchQuery, selectedParties, blockedParties]);

  const addParty = (partyName: string) => {
    if (!selectedParties.includes(partyName)) {
      setSelectedParties((prev) => [...prev, partyName]);
      if (!wordcloudParty) setWordcloudParty(partyName);
    }
    setSelectorOpen(false);
    setSearchQuery("");
  };

  const removeParty = (partyName: string) => {
    setSelectedParties((prev) => prev.filter((n) => n !== partyName));
    if (wordcloudParty === partyName) {
      const remaining = selectedParties.find((n) => n !== partyName);
      setWordcloudParty(remaining ?? "");
    }
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "radar", label: "Radar de Valores", icon: "📊" },
    { id: "nolan", label: "Diagrama de Nolan", icon: "🧭" },
    { id: "wordcloud", label: "Nube de Palabras", icon: "☁️" },
  ];

  if (loading) {
    return (
      <main>
        <Nav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-button-background-primary/30 border-t-button-background-primary rounded-full animate-spin mx-auto" />
            <p className="font-body text-subtitle/60">
              Cargando datos de partidos...
            </p>
          </div>
        </div>
      </main>
    );
  }

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

      {/* Header */}
      <div className="py-8 border-y text-center border-subtitle">
        <h1 className="font-title text-subtitle text-4xl sm:text-5xl font-extrabold">
          Comparar Partidos
        </h1>
        <p className="font-body text-subtitle/70 mt-1">
          Analiza y compara partidos con gráficos interactivos
        </p>
        {tourCompleted && (
          <button
            onClick={() => setRunTour(true)}
            className="mt-2 text-xs font-body text-button-background-primary hover:underline"
          >
            🎯 Ver tutorial nuevamente
          </button>
        )}
      </div>

      {/* Party selector */}
      <div className="tour-selector-partidos my-6 space-y-4">
        {/* Selected parties chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-body font-bold text-subtitle/50 uppercase">
            Partidos:
          </span>
          {selectedParties.length === 0 && (
            <span className="text-sm font-body text-subtitle/40 italic">
              Agrega partidos para comparar...
            </span>
          )}
          {selectedParties.map((name) => {
            const party = PARTIES.find((p) => p.name === name);
            return (
              <div
                key={name}
                className="flex items-center gap-1.5 pl-1 pr-2 py-1 bg-white border-2 border-subtitle/20 rounded-full hover:border-button-background-primary/50 transition-colors"
              >
                {party && (
                  <Image
                    src={party.logo}
                    alt={name}
                    width={22}
                    height={22}
                    className="rounded-full object-contain"
                  />
                )}
                <span className="text-xs font-body font-bold text-subtitle max-w-30 truncate">
                  {name}
                </span>
                <button
                  onClick={() => removeParty(name)}
                  className="w-4 h-4 flex items-center justify-center text-[10px] text-subtitle/40 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
            );
          })}

          {/* Add button */}
          <button
            onClick={() => setSelectorOpen(!selectorOpen)}
            className="flex items-center gap-1 px-3 py-1.5 border-2 border-dashed border-button-background-primary/40 rounded-full text-xs font-body font-bold text-button-background-primary hover:bg-button-background-primary/5 transition-colors"
          >
            <span className="text-base leading-none">+</span> Agregar partido
          </button>
        </div>

        {/* Dropdown selector */}
        {selectorOpen && (
          <div className="bg-white border-2 border-subtitle/20 rounded-2xl shadow-xl overflow-hidden animate-scaleIn max-h-90 flex flex-col">
            <div className="p-3 border-b border-subtitle/10">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar partido..."
                className="w-full px-3 py-2 rounded-lg border border-subtitle/20 font-body text-sm text-subtitle bg-button-background-secondary/20 focus:outline-none focus:border-button-background-primary"
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredParties.length === 0 ? (
                <p className="p-4 text-center font-body text-xs text-subtitle/40">
                  No se encontraron partidos
                </p>
              ) : (
                filteredParties.map((p) => {
                  const inRadar = availableRadarParties.includes(p.name);
                  const inNolan = availableNolanParties.includes(p.name);
                  return (
                    <button
                      key={p.id}
                      onClick={() => addParty(p.name)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-button-background-secondary/20 transition-colors text-left"
                    >
                      <Image
                        src={p.logo}
                        alt={p.name}
                        width={32}
                        height={32}
                        className="rounded object-contain shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-body text-sm text-subtitle font-bold block truncate">
                          {p.name}
                        </span>
                        <div className="flex gap-1 mt-0.5">
                          {inRadar && (
                            <span className="text-[9px] px-1 py-0.5 bg-blue-50 text-blue-500 rounded font-bold">
                              Radar
                            </span>
                          )}
                          {inNolan && (
                            <span className="text-[9px] px-1 py-0.5 bg-green-50 text-green-500 rounded font-bold">
                              Nolan
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="tour-tabs flex items-stretch justify-center gap-1 bg-button-background-secondary/20 rounded-xl p-1 border-2 border-subtitle/10 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tour-tab-${tab.id} flex-1 py-2.5 px-3 rounded-lg font-body text-sm font-semibold transition-all border-2 flex items-center justify-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-button-background-primary text-white shadow-md border-button-background-primary"
                : "text-subtitle hover:bg-white/50 border-transparent"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {selectedParties.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-87.5 text-center space-y-4 py-12">
          <Image
            src="/pose/searching.png"
            alt="Buscar"
            width={150}
            height={150}
            className="opacity-70"
          />
          <h3 className="font-title text-subtitle text-xl font-bold">
            Selecciona partidos para comparar
          </h3>
          <p className="font-body text-subtitle/60 text-sm max-w-md">
            Usa el botón &quot;Agregar partido&quot; arriba para añadir partidos
            a la comparación. Puedes agregar varios al mismo tiempo.
          </p>
        </div>
      ) : (
        <div className="tour-chart-area pb-12">
          {activeTab === "radar" && (
            <RadarValores
              data={radarData as never[]}
              selectedParties={selectedParties}
            />
          )}
          {activeTab === "nolan" && (
            <div className="space-y-4">
              {/* Toggle guía de posiciones */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowNolanGuide(!showNolanGuide)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-subtitle/20 font-body text-sm text-subtitle hover:bg-gray-50 transition-colors"
                >
                  <span>❓</span>
                  {showNolanGuide
                    ? "Ocultar guía"
                    : "¿Qué significa cada posición?"}
                  <span
                    className={`text-xs transition-transform ${showNolanGuide ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </button>
              </div>
              {showNolanGuide && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <p className="font-body text-sm font-bold text-blue-800 mb-1">
                      🗽 Libertario
                    </p>
                    <p className="font-body text-xs text-blue-700 leading-relaxed">
                      Quiere más libertad en todo: que el Estado no se meta ni
                      en tu economía ni en tu vida personal. Menos impuestos,
                      menos regulaciones, más decisiones individuales.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                    <p className="font-body text-sm font-bold text-red-800 mb-1">
                      👊 Autoritario
                    </p>
                    <p className="font-body text-xs text-red-700 leading-relaxed">
                      Quiere un Estado fuerte que controle tanto la economía
                      como la vida personal. Más reglas, más orden, más
                      intervención del gobierno en todo.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-50 border border-green-200">
                    <p className="font-body text-sm font-bold text-green-800 mb-1">
                      🌿 Liberal (Izquierda)
                    </p>
                    <p className="font-body text-xs text-green-700 leading-relaxed">
                      Defiende la libertad personal (cada quien vive como
                      quiera), pero quiere que el Estado intervenga más en la
                      economía para reducir la desigualdad.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <p className="font-body text-sm font-bold text-amber-800 mb-1">
                      🏛️ Conservador (Derecha)
                    </p>
                    <p className="font-body text-xs text-amber-700 leading-relaxed">
                      Apoya la libertad económica (libre mercado, menos
                      impuestos), pero quiere que el Estado regule más la vida
                      personal con valores tradicionales.
                    </p>
                  </div>
                </div>
              )}
              <DiagramaNolan
                data={nolanData as never[]}
                selectedParties={selectedParties}
              />
            </div>
          )}
          {activeTab === "wordcloud" && (
            <div className="space-y-4">
              {/* Party selector for wordcloud (single) */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <span className="text-xs font-body font-bold text-subtitle/50 uppercase">
                  Partido para Wordcloud:
                </span>
                <select
                  value={wordcloudParty}
                  onChange={(e) => setWordcloudParty(e.target.value)}
                  className="px-3 py-2 rounded-lg border-2 border-subtitle/20 font-body text-sm text-subtitle bg-white focus:outline-none focus:border-button-background-primary"
                >
                  {selectedParties.map((name) => {
                    const inWC = availableWordcloudParties.includes(name);
                    return (
                      <option key={name} value={name} disabled={!inWC}>
                        {name} {inWC ? "" : "(sin datos)"}
                      </option>
                    );
                  })}
                </select>
              </div>

              <WordcloudChart
                data={wordcloudData as never[]}
                selectedParty={wordcloudParty}
              />
            </div>
          )}
        </div>
      )}

      {/* PopUp Aliado Decide.pe */}
      {allyPopupState !== "hidden" && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-sm border border-subtitle/20 shadow-xl px-5 py-3 rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.26,1.55)] ${
            allyPopupState === "visible"
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-20 opacity-0 scale-50"
          }`}
        >
          <span className="font-body text-sm font-semibold text-subtitle/90 whitespace-nowrap">
            Gracias a nuestro aliado decide.pe
          </span>
          <div className="w-16 h-8 md:w-20 md:h-10 relative flex-shrink-0 bg-white rounded-md p-1 shadow-sm">
            <Image
              src="/decide.png"
              alt="decide.pe"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default function CompararPage() {
  return (
    <Suspense
      fallback={
        <main>
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-button-background-primary/30 border-t-button-background-primary rounded-full animate-spin" />
          </div>
        </main>
      }
    >
      <CompararContent />
    </Suspense>
  );
}
