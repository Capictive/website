"use client";
import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Nav from "../components/Nav";
import { PARTIES } from "../lib/parties";
import dynamic from "next/dynamic";

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

function CompararContent() {
  const searchParams = useSearchParams();
  const initialParty = searchParams.get("partido") || "";

  const [activeTab, setActiveTab] = useState<Tab>("radar");
  const [selectedParties, setSelectedParties] = useState<string[]>([]);
  const [wordcloudParty, setWordcloudParty] = useState<string>("");
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // JSON data
  const [radarData, setRadarData] = useState<unknown[]>([]);
  const [nolanData, setNolanData] = useState<unknown[]>([]);
  const [wordcloudData, setWordcloudData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Set initial party from URL (only once on mount)
  useEffect(() => {
    if (!initialParty) return;
    const found = PARTIES.find(
      (p) => p.name.toLowerCase() === initialParty.toLowerCase(),
    );
    if (found) {
      // Use functional updater to avoid cascading render warning
      setSelectedParties((prev) => (prev.length === 0 ? [found.name] : prev));
      setWordcloudParty((prev) => prev || found.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Party name list from data that exists in radar/nolan
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const availableRadarParties = useMemo(
    () => radarData.map((d: any) => d.partido),
    [radarData],
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const availableNolanParties = useMemo(
    () => nolanData.map((d: any) => d.nombre),
    [nolanData],
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const availableWordcloudParties = useMemo(
    () => wordcloudData.map((d: any) => d.partido),
    [wordcloudData],
  );

  const filteredParties = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return PARTIES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) && !selectedParties.includes(p.name),
    );
  }, [searchQuery, selectedParties]);

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
      <Nav />

      {/* Header */}
      <div className="py-8 border-y text-center border-subtitle">
        <h1 className="font-title text-subtitle text-4xl sm:text-5xl font-extrabold">
          Comparar Partidos
        </h1>
        <p className="font-body text-subtitle/70 mt-1">
          Analiza y compara partidos con gráficos interactivos
        </p>
      </div>

      {/* Party selector */}
      <div className="my-6 space-y-4">
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
      <div className="flex items-stretch justify-center gap-1 bg-button-background-secondary/20 rounded-xl p-1 border-2 border-subtitle/10 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 px-3 rounded-lg font-body text-sm font-semibold transition-all border-2 flex items-center justify-center gap-1.5 ${
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
        <div className="pb-12">
          {activeTab === "radar" && (
            <RadarValores
              data={radarData as never[]}
              selectedParties={selectedParties}
            />
          )}
          {activeTab === "nolan" && (
            <DiagramaNolan
              data={nolanData as never[]}
              selectedParties={selectedParties}
            />
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
