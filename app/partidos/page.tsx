"use client";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
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
      fetchPartyDetail(selected.name).then((data) => setDetailState({detail: data, loading: false}));
    } else {
      setDetailState({detail: null, loading: false});
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
                  <h3 className="font-title text-subtitle text-2xl font-bold">Ejes Principales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {detailState.detail.ejes.map((eje, index) => (
                      <div key={index} className="border rounded-md p-4 space-y-2 shadow-lg bg-white">
                        <h4 className="font-title text-subtitle text-xl font-semibold">{eje.categoria}</h4>
                        <p className="font-body font-bold text-subtitle">{eje.propuesta_estrella}</p>
                        <div className="space-y-1">
                          {eje.que_proponen.map((propuesta, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-green-500 text-lg">✔</span>
                              <span className="font-body text-sm">{propuesta}</span>
                            </div>
                          ))}
                        </div>
                        <p className="font-body text-sm italic bg-gray-100 p-2 rounded">Dato curioso: {eje.dato_curioso}</p>
                        <p className="font-body text-sm bg-yellow-100 p-3 rounded shadow-sm border-l-4 border-yellow-500">Reflexión: {eje.para_reflexionar}</p>
                        <div className="border-t pt-2 bg-gray-50 p-3 rounded-lg shadow-inner">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">{flagMap[eje.benchmark_internacional.codigo_pais] || "🏛️"}</span>
                            <div>
                              <p className="font-body text-sm font-semibold text-subtitle">{eje.benchmark_internacional.caso_similar}</p>
                              <p className="font-body text-xs text-gray-600">({eje.benchmark_internacional.codigo_pais})</p>
                            </div>
                          </div>
                          <p className="font-body text-sm mb-1">{eje.benchmark_internacional.descripcion}</p>
                          <p className="font-body text-sm font-medium text-green-700">Lección: {eje.benchmark_internacional.leccion}</p>
                          <p className="font-body text-sm text-blue-600">Similitud: {eje.benchmark_internacional.nivel_similitud}</p>
                        </div>
                      </div>
                    ))}
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
