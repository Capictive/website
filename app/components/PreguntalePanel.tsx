"use client";

import { useState, useEffect, useCallback } from "react";

/* ─── Types ─── */
interface Respuesta {
  preguntaId: number;
  pregunta: string;
  respuesta: string;
  fuentes: string[];
  insight: string;
  emoji: string;
  tono: string;
}

interface Conversacion {
  id: string;
  partido: string;
  fecha: string;
  preguntas: string[];
  respuestas: Respuesta[];
}

interface PreguntalePanelProps {
  readonly partyName: string;
}

const STORAGE_KEY = "capictive-conversaciones";

function loadConversaciones(): Conversacion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConversaciones(convs: Conversacion[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
}

/* ─── Tono badge color ─── */
const TONO_COLORS: Record<string, string> = {
  informativo: "bg-blue-100 text-blue-800",
  crítico: "bg-red-100 text-red-800",
  positivo: "bg-green-100 text-green-800",
  neutral: "bg-gray-100 text-gray-700",
};

function tonoBadge(tono: string) {
  const lower = tono.toLowerCase();
  for (const [key, cls] of Object.entries(TONO_COLORS)) {
    if (lower.includes(key)) return cls;
  }
  return "bg-purple-100 text-purple-800";
}

/* ─── Main Component ─── */
export default function PreguntalePanel({ partyName }: PreguntalePanelProps) {
  const [preguntas, setPreguntas] = useState<[string, string, string]>([
    "",
    "",
    "",
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<Respuesta[] | null>(null);
  const [historial, setHistorial] = useState<Conversacion[]>([]);
  const [showHistorial, setShowHistorial] = useState(false);
  const [activeRespuesta, setActiveRespuesta] = useState<number>(0);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  // Load historial on mount & party change
  useEffect(() => {
    const all = loadConversaciones();
    setHistorial(all.filter((c) => c.partido === partyName));
    // Reset form on party change
    setPreguntas(["", "", ""]);
    setCurrentResult(null);
    setError(null);
    setActiveRespuesta(0);
  }, [partyName]);

  const filledCount = preguntas.filter((p) => p.trim().length > 0).length;

  const handleSubmit = useCallback(async () => {
    if (filledCount === 0) return;
    setLoading(true);
    setError(null);
    setCurrentResult(null);

    // Build payload only with filled questions
    const payload: Record<string, string> = { partido: partyName };
    preguntas.forEach((p, i) => {
      if (p.trim()) payload[`pregunta${i + 1}`] = p.trim();
    });

    try {
      const res = await fetch("https://talk.capictive.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      const respuestas: Respuesta[] = data.respuestas ?? [];
      setCurrentResult(respuestas);
      setActiveRespuesta(0);

      // Save to localStorage
      const newConv: Conversacion = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        partido: partyName,
        fecha: new Date().toLocaleString("es-PE"),
        preguntas: preguntas.filter((p) => p.trim()),
        respuestas,
      };
      const all = loadConversaciones();
      all.unshift(newConv);
      saveConversaciones(all);
      setHistorial(all.filter((c) => c.partido === partyName));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo conectar con el servidor",
      );
    } finally {
      setLoading(false);
    }
  }, [filledCount, partyName, preguntas]);

  const deleteConversacion = (id: string) => {
    const all = loadConversaciones().filter((c) => c.id !== id);
    saveConversaciones(all);
    setHistorial(all.filter((c) => c.partido === partyName));
  };

  const deleteAll = () => {
    const all = loadConversaciones().filter((c) => c.partido !== partyName);
    saveConversaciones(all);
    setHistorial([]);
    setConfirmDeleteAll(false);
  };

  const loadFromHistorial = (conv: Conversacion) => {
    setCurrentResult(conv.respuestas);
    setActiveRespuesta(0);
    setShowHistorial(false);
  };

  return (
    <div className="space-y-4">
      {/* ── Input Section ── */}
      <div className="bg-white rounded-xl border shadow-lg p-4 md:p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🤖</span>
          <h4 className="font-title text-subtitle text-lg font-bold">
            Pregúntale sobre {partyName}
          </h4>
        </div>
        <p className="font-body text-xs text-subtitle/70">
          Escribe hasta 3 preguntas sobre este partido. La IA analizará su plan
          de gobierno y te dará respuestas con fuentes.
        </p>

        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-1">
            <label className="font-body text-xs font-semibold text-subtitle/70">
              Pregunta {i + 1}{" "}
              {i > 0 && (
                <span className="text-subtitle/40 font-normal">(opcional)</span>
              )}
            </label>
            <input
              value={preguntas[i]}
              onChange={(e) => {
                const next: [string, string, string] = [...preguntas];
                next[i] = e.target.value;
                setPreguntas(next);
              }}
              placeholder={
                i === 0
                  ? "Ej: ¿Qué hará contra la inseguridad?"
                  : i === 1
                    ? "Ej: ¿Cómo mejorarán la educación?"
                    : "Ej: ¿Qué proponen para la economía?"
              }
              disabled={loading}
              className="w-full px-3 py-2.5 rounded-lg border border-subtitle/30 font-body text-sm text-subtitle bg-button-background-secondary/10 focus:border-button-background-primary focus:ring-1 focus:ring-button-background-primary/30 outline-none transition-colors disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && filledCount > 0 && !loading) {
                  handleSubmit();
                }
              }}
            />
          </div>
        ))}

        <div className="flex items-center justify-between gap-3">
          <span className="font-body text-xs text-subtitle/50">
            {filledCount}/3 preguntas
          </span>
          <button
            onClick={handleSubmit}
            disabled={filledCount === 0 || loading}
            className="btn-primary text-sm flex items-center gap-2 disabled:opacity-40"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin">🔄</span>{" "}
                Analizando...
              </>
            ) : (
              <>🚀 Preguntar</>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg font-body text-sm border border-red-200">
            ❌ {error}
          </div>
        )}
      </div>

      {/* ── Results Section ── */}
      {currentResult && currentResult.length > 0 && (
        <div className="space-y-3 animate-fadeIn">
          {/* Tabs for each answer */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {currentResult.map((r, i) => (
              <button
                key={r.preguntaId}
                onClick={() => setActiveRespuesta(i)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full font-body text-sm font-medium transition-all ${
                  activeRespuesta === i
                    ? "bg-button-background-primary text-white shadow-md"
                    : "bg-button-background-secondary/30 text-subtitle hover:bg-button-background-secondary/50"
                }`}
              >
                {r.emoji} Pregunta {r.preguntaId}
              </button>
            ))}
          </div>

          {/* Active answer card */}
          <RespuestaCard respuesta={currentResult[activeRespuesta]} />
        </div>
      )}

      {/* ── Historial Section ── */}
      <div className="border-t pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowHistorial(!showHistorial)}
            className="font-body text-sm font-semibold text-subtitle flex items-center gap-2 hover:text-button-background-primary transition-colors"
          >
            <span>📂</span> Conversaciones guardadas
            {historial.length > 0 && (
              <span className="bg-button-background-primary/20 text-button-background-primary text-xs px-2 py-0.5 rounded-full font-bold">
                {historial.length}
              </span>
            )}
            <span
              className={`transition-transform ${showHistorial ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </button>

          {historial.length > 0 && showHistorial && (
            <div className="relative">
              {confirmDeleteAll ? (
                <div className="flex items-center gap-2">
                  <span className="font-body text-xs text-red-600">
                    ¿Seguro?
                  </span>
                  <button
                    onClick={deleteAll}
                    className="text-xs font-body text-red-600 font-bold hover:underline"
                  >
                    Sí, borrar
                  </button>
                  <button
                    onClick={() => setConfirmDeleteAll(false)}
                    className="text-xs font-body text-subtitle/50 hover:underline"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteAll(true)}
                  className="text-xs font-body text-red-500 hover:text-red-700 transition-colors"
                >
                  🗑️ Borrar todo
                </button>
              )}
            </div>
          )}
        </div>

        {showHistorial && (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {historial.length === 0 ? (
              <p className="font-body text-sm text-subtitle/50 text-center py-4">
                Aún no has hecho preguntas sobre este partido.
              </p>
            ) : (
              historial.map((conv) => (
                <div
                  key={conv.id}
                  className="bg-white border rounded-lg p-3 space-y-2 hover:border-button-background-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <button
                      onClick={() => loadFromHistorial(conv)}
                      className="flex-1 text-left space-y-1"
                    >
                      <p className="font-body text-xs text-subtitle/50">
                        {conv.fecha}
                      </p>
                      {conv.preguntas.map((p, i) => (
                        <p
                          key={i}
                          className="font-body text-sm text-subtitle flex items-start gap-1"
                        >
                          <span className="text-button-background-primary flex-shrink-0">
                            •
                          </span>
                          <span className="line-clamp-1">{p}</span>
                        </p>
                      ))}
                    </button>
                    <button
                      onClick={() => deleteConversacion(conv.id)}
                      className="p-1.5 text-subtitle/30 hover:text-red-500 transition-colors flex-shrink-0"
                      title="Eliminar conversación"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Answer Card ─── */
function RespuestaCard({ respuesta }: { readonly respuesta: Respuesta }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-xl p-4 md:p-5 space-y-4 shadow-lg bg-white">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="text-3xl">{respuesta.emoji}</span>
        <div className="flex-1 space-y-1">
          <h4 className="font-title text-subtitle text-base md:text-lg font-bold leading-snug">
            {respuesta.pregunta}
          </h4>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${tonoBadge(respuesta.tono)}`}
          >
            {respuesta.tono}
          </span>
        </div>
      </div>

      {/* Insight highlight */}
      <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-500">
        <p className="font-body text-xs uppercase font-bold text-amber-700 mb-1">
          💡 Insight clave
        </p>
        <p className="font-body text-sm text-amber-900 leading-relaxed">
          {respuesta.insight}
        </p>
      </div>

      {/* Full answer (collapsible) */}
      <div className="space-y-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="font-body text-sm font-semibold cursor-pointer flex items-center gap-2 bg-gray-100 p-2 rounded-lg w-full text-left hover:bg-gray-200 transition-colors"
        >
          <span>📝</span> Respuesta completa
          <span
            className={`ml-auto transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>
        {expanded && (
          <div className="p-3 bg-gray-50 rounded-lg border font-body text-sm text-subtitle leading-relaxed animate-fadeIn">
            {respuesta.respuesta}
          </div>
        )}
      </div>

      {/* Sources */}
      {respuesta.fuentes.length > 0 && (
        <div className="space-y-1.5">
          <p className="font-body text-xs uppercase font-bold text-subtitle/60">
            📚 Fuentes
          </p>
          <div className="flex flex-wrap gap-2">
            {respuesta.fuentes.map((fuente, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-50 rounded-md text-xs font-body text-blue-700 border border-blue-200"
              >
                {fuente}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
