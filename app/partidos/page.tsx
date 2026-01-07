"use client";
import Image from "next/image";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Nav from "../components/Nav";
import { PARTIES, Party, PartyDetail } from "../lib/parties";

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

export default function PartidosPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Party | null>(PARTIES[0]);
  const [detailState, setDetailState] = useState<{detail: PartyDetail | null, loading: boolean}>({detail: null, loading: false});
  const [currentEjeIndex, setCurrentEjeIndex] = useState(0);

  const perPage = 5;
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return PARTIES.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(safePage * perPage, safePage * perPage + perPage);

  useEffect(() => {
    if (selected) {
      setDetailState({detail: null, loading: true});
      setCurrentEjeIndex(0);
      fetchPartyDetail(selected.name).then((data) => setDetailState({detail: data, loading: false}));
    } else {
      setDetailState({detail: null, loading: false});
      setCurrentEjeIndex(0);
    }
  }, [selected]);

  return (
    <main>
      <Nav />

      {/* Encabezado periódico */}
      <div className="mt-6 py-8 border-y text-center border-subtitle">
        <h1 className="font-title text-subtitle text-6xl font-extrabold">Partidos Políticos</h1>
        <p className="font-body">Explora y compara propuestas de manera simple</p>
      </div>

      {/* Grid principal: lista + detalle */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Lista y filtros */}
        <aside className="col-span-1 space-y-4">
          <div className="flex items-center gap-3">
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
                <button
                  key={p.id}
                  className={`card rounded-md border w-full text-left ${selected?.id === p.id ? "border-button-background-primary" : "border-subtitle"}`}
                  onClick={() => setSelected(p)}
                >
                  <div className="flex items-center gap-3">
                    <Image src={p.logo} alt={p.name} width={48} height={48} />
                    <span className="font-body text-subtitle">{p.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Detalle del partido seleccionado */}
        <article className="col-span-2 border rounded-md border-subtitle p-6 space-y-6">
          {selected ? (
            detailState.loading ? (
              <p className="font-body">Cargando detalles...</p>
            ) : detailState.detail ? (
              <div className="space-y-6">
                {/* Encabezado centrado con logo y candidato */}
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="flex flex-col items-center">
                    <Image src={detailState.detail.logo_links[0] || selected.logo} alt={selected.name} width={120} height={120} />
                    <Image
                      src={detailState.detail.presidente_links[0] || selected.candidateImage}
                      alt={`Candidato ${selected.name}`}
                      width={240}
                      height={240}
                      className="mt-4 rounded-md border border-subtitle object-cover aspect-square w-full max-w-[240px]"
                    />
                  </div>
                  <div className="flex-1 space-y-3 text-center md:text-left">
                    <h2 className="font-title text-subtitle text-4xl font-bold">{detailState.detail.partido}</h2>
                    <p className="font-body italic text-lg">{detailState.detail.slogan_detectado}</p>
                    <p className="font-body">{detailState.detail.vision_resumen}</p>
                    <div className="flex gap-3 justify-center md:justify-start">
                      <a href={`https://files.capictive.app/Partidos%20Politicos/${encodeURIComponent(detailState.detail.partido)}/PLAN%20RESUMEN.pdf`} target="_blank" className="btn-primary">Plan Resumen PDF</a>
                      <a href={`https://files.capictive.app/Partidos%20Politicos/${encodeURIComponent(detailState.detail.partido)}/PLAN%20GOBIERNO.pdf`} target="_blank" className="btn-secondary">Plan Gobierno PDF</a>
                      <button className="btn-secondary">Comparar</button>
                    </div>
                  </div>
                </div>

                 {/* Ejes */}
                <div className="space-y-4">
                  <h3 className="font-title text-subtitle text-2xl font-bold flex items-center gap-2">
                    <span>📋</span> Ejes Principales
                  </h3>
                  
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
          ) : (
            <p className="font-body">Selecciona un partido para ver detalles.</p>
          )}
        </article>
      </section>
    </main>
  );
}

// Component for individual Eje Card
import { Eje } from "../lib/parties";

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
