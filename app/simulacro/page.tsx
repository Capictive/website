"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import BallotSheet from "@/app/components/voting/BallotSheet";
import Nav from "@/app/components/Nav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { mockParties } from "@/app/data/mockParties";
import Image from "next/image";

const API_BASE_URL = "https://candidates.capictive.app";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

interface FavCandidato {
  id: number;
  nombreCompleto: string;
  numeroCandidato: number | null;
  partido: string;
  cargo: string;
}

interface SearchCandidato {
  id: number;
  nombreCompleto: string;
  numeroCandidato: number | null;
  partido: string;
  cargo: string;
  postulaDepartamento: string;
}

export default function SimulacroPage() {
  const [favoriteNames, setFavoriteNames] = useState<string[]>([]);
  const [showFavs, setShowFavs] = useState(true);
  const [favCandidatos, setFavCandidatos] = useState<FavCandidato[]>([]);
  const [showFavCands, setShowFavCands] = useState(true);

  // Búsqueda de candidatos
  const [candSearchInput, setCandSearchInput] = useState("");
  const [candSearchResults, setCandSearchResults] = useState<SearchCandidato[]>(
    [],
  );
  const [candSearchLoading, setCandSearchLoading] = useState(false);
  const [showCandSearch, setShowCandSearch] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("capictive-favoritos");
      if (raw) setFavoriteNames(JSON.parse(raw));
    } catch {
      /* empty */
    }
    try {
      const raw2 = localStorage.getItem("capictive-favoritos-candidatos");
      if (raw2) setFavCandidatos(JSON.parse(raw2));
    } catch {
      /* empty */
    }
  }, []);

  // Map favorited party names → mockParties entries with ballot number
  const favoritesWithBallot = favoriteNames
    .map((favName) => {
      const normFav = normalize(favName);
      const idx = mockParties.findIndex((mp) => normalize(mp.name) === normFav);
      if (idx === -1) return null;
      return {
        party: mockParties[idx],
        ballotNumber: idx + 1,
        partyId: mockParties[idx].id,
      };
    })
    .filter(Boolean) as {
    party: (typeof mockParties)[number];
    ballotNumber: number;
    partyId: string;
  }[];

  // Build set of mockParties IDs that are favorites
  const favoritePartyIds = favoritesWithBallot.map((f) => f.partyId);

  // Group favorite candidates by cargo type
  const candsPorCargo = useMemo(() => {
    const groups: Record<string, FavCandidato[]> = {};
    favCandidatos.forEach((c) => {
      let label = c.cargo;
      if (c.cargo.includes("SENADOR")) label = "Senadores";
      else if (c.cargo.includes("DIPUTADO")) label = "Diputados";
      else if (c.cargo.includes("PARLAMENTO")) label = "Parlamento Andino";
      else if (
        c.cargo.includes("PRESIDENTE") ||
        c.cargo.includes("VICEPRESIDENTE")
      )
        label = "Fórmula Presidencial";
      if (!groups[label]) groups[label] = [];
      groups[label].push(c);
    });
    return groups;
  }, [favCandidatos]);

  // Buscar candidatos por nombre en la API
  const handleCandSearch = useCallback(async () => {
    const query = candSearchInput.trim().toUpperCase();
    if (!query) return;
    setCandSearchLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/candidatos?nombreCompleto=${encodeURIComponent(query)}`,
      );
      if (!res.ok) throw new Error("Error al buscar candidatos");
      const data = await res.json();
      setCandSearchResults(data.data || []);
    } catch {
      setCandSearchResults([]);
    } finally {
      setCandSearchLoading(false);
    }
  }, [candSearchInput]);

  // Toggle favorito desde búsqueda
  const toggleSearchFav = useCallback((c: SearchCandidato) => {
    setFavCandidatos((prev) => {
      const exists = prev.some((f) => f.id === c.id);
      const next = exists
        ? prev.filter((f) => f.id !== c.id)
        : [
            ...prev,
            {
              id: c.id,
              nombreCompleto: c.nombreCompleto,
              numeroCandidato: c.numeroCandidato,
              partido: c.partido,
              cargo: c.cargo,
            },
          ];
      localStorage.setItem(
        "capictive-favoritos-candidatos",
        JSON.stringify(next),
      );
      return next;
    });
  }, []);

  return (
    <main className="min-h-screen pb-20 font-body">
      <Nav />

      <div className="w-full px-4 md:px-8 py-8">
        <div className="mb-6 container mx-auto">
          <Link
            href="/"
            className="inline-flex cursor-pointer text-subtitle items-center gap-2 text-sm font-bold transition-colors hover:opacity-80"
          >
            <ArrowLeft size={20} />
            Volver al inicio
          </Link>
        </div>

        <div className="text-center mb-10 container mx-auto">
          <h1 className="font-title text-subtitle text-3xl md:text-5xl font-extrabold mb-4">
            Simulacro de Votación 2026
          </h1>
          <p className="font-body text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-subtitle">
            Practica tu voto de manera responsable con nuestra cédula
            interactiva.
            <br className="hidden md:block" /> Simula la experiencia real antes
            del domingo de elecciones.
          </p>
        </div>

        {/* Favoritos panel */}
        {favoritesWithBallot.length > 0 && (
          <div className="container mx-auto mb-8">
            <button
              onClick={() => setShowFavs(!showFavs)}
              className="flex items-center gap-2 mb-3 font-body text-sm font-semibold text-subtitle hover:text-[#b9832c] transition-colors"
            >
              <span>❤️</span> Mis partidos favoritos (
              {favoritesWithBallot.length})
              <span
                className={`transition-transform text-xs ${showFavs ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>
            {showFavs && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fadeIn">
                {favoritesWithBallot.map(({ party, ballotNumber }) => (
                  <div
                    key={party.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-[#b9832c]/30 shadow-sm hover:border-[#b9832c] transition-colors"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#b9832c] text-white font-title font-extrabold text-lg shrink-0">
                      {ballotNumber}
                    </div>
                    <div className="w-10 h-10 relative shrink-0">
                      <Image
                        src={party.logo}
                        alt={party.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-bold text-subtitle truncate">
                        {party.name}
                      </p>
                      <p className="font-body text-[10px] text-subtitle/60">
                        N° de orden en cédula: {ballotNumber}
                      </p>
                    </div>
                    <span className="text-red-500 text-lg shrink-0">❤️</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Candidatos favoritos panel */}
        {favCandidatos.length > 0 && (
          <div className="container mx-auto mb-8">
            <button
              onClick={() => setShowFavCands(!showFavCands)}
              className="flex items-center gap-2 mb-3 font-body text-sm font-semibold text-subtitle hover:text-[#b9832c] transition-colors"
            >
              <span>🗳️</span> Mis candidatos favoritos ({favCandidatos.length})
              <span
                className={`transition-transform text-xs ${showFavCands ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>
            {showFavCands && (
              <div className="space-y-4 animate-fadeIn">
                {Object.entries(candsPorCargo).map(([cargo, cands]) => (
                  <div key={cargo}>
                    <h4 className="font-body text-xs font-bold text-subtitle/60 uppercase mb-2">
                      {cargo}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {cands.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-red-200 shadow-sm"
                        >
                          {c.numeroCandidato != null && (
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white font-title font-extrabold text-lg shrink-0">
                              {c.numeroCandidato}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm font-bold text-subtitle truncate">
                              {c.nombreCompleto}
                            </p>
                            <p className="font-body text-[10px] text-subtitle/60">
                              {c.partido}
                            </p>
                            {c.numeroCandidato != null && (
                              <p className="font-body text-[10px] text-red-500 font-bold">
                                Escribe N° {c.numeroCandidato} en voto
                                preferencial
                              </p>
                            )}
                          </div>
                          <span className="text-red-500 text-lg shrink-0">
                            ❤️
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Buscar candidatos por nombre */}
        <div className="container mx-auto mb-8">
          <button
            onClick={() => setShowCandSearch(!showCandSearch)}
            className="flex items-center gap-2 mb-3 font-body text-sm font-semibold text-subtitle hover:text-button-background-primary transition-colors"
          >
            <span>🔍</span> Buscar candidatos por nombre
            <span
              className={`transition-transform text-xs ${showCandSearch ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </button>
          {showCandSearch && (
            <div className="bg-white/60 rounded-2xl border border-subtitle/20 p-4 animate-fadeIn">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={candSearchInput}
                  onChange={(e) => setCandSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCandSearch();
                  }}
                  placeholder="Ej: ROBERTO"
                  className="flex-1 px-4 py-2 rounded-lg border border-subtitle/20 bg-white font-body text-subtitle focus:outline-none focus:border-button-background-primary"
                />
                <button
                  onClick={handleCandSearch}
                  disabled={candSearchLoading}
                  className="px-4 py-2 rounded-lg bg-button-background-primary text-white font-body text-sm font-bold hover:bg-button-background-primary/90 transition-colors disabled:opacity-50"
                >
                  {candSearchLoading ? "..." : "🔍 Buscar"}
                </button>
              </div>

              {/* Resultados */}
              {candSearchResults.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {candSearchResults.map((c) => {
                    const isFav = favCandidatos.some((f) => f.id === c.id);
                    return (
                      <div
                        key={c.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                          isFav
                            ? "bg-red-50 border-red-200"
                            : "bg-white border-subtitle/10"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-body text-sm font-bold text-subtitle truncate">
                            {c.nombreCompleto}
                          </p>
                          <p className="font-body text-[10px] text-subtitle/60">
                            {c.partido} · {c.cargo} · {c.postulaDepartamento}
                          </p>
                          {c.numeroCandidato != null && (
                            <p className="font-body text-[10px] text-subtitle/50">
                              N° candidato: {c.numeroCandidato}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => toggleSearchFav(c)}
                          className="text-lg shrink-0 ml-2 hover:scale-125 transition-transform"
                          title={
                            isFav
                              ? "Quitar de favoritos"
                              : "Agregar a favoritos"
                          }
                        >
                          {isFav ? "❤️" : "🤍"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {candSearchResults.length === 0 &&
                candSearchInput.trim() &&
                !candSearchLoading && (
                  <p className="text-sm font-body text-subtitle/50 text-center py-2">
                    Sin resultados. Intenta con otro nombre.
                  </p>
                )}
            </div>
          )}
        </div>

        {/* Contenedor fluido sin max-w restrictivo en desktop */}
        <div className="w-full">
          <BallotSheet
            favoritePartyIds={favoritePartyIds}
            favoriteCandidates={favCandidatos}
          />
        </div>
      </div>
    </main>
  );
}
