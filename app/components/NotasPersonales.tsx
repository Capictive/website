"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Types ─── */
type Seccion = "ejes" | "problemas" | "escandalos";

interface Nota {
  id: string;
  texto: string;
  fecha: string;
}

type NotasStore = Record<string, Record<Seccion, Nota[]>>;
// key = partyName, value = { ejes: [...], problemas: [...], escandalos: [...] }

interface NotasPersonalesProps {
  readonly partyName: string;
  readonly seccion: Seccion;
}

const STORAGE_KEY = "capictive-notas";

const SECCION_LABELS: Record<Seccion, { emoji: string; label: string }> = {
  ejes: { emoji: "📋", label: "Ejes" },
  problemas: { emoji: "⚠️", label: "Problemas" },
  escandalos: { emoji: "🚨", label: "Escándalos" },
};

function loadNotas(): NotasStore {
  if (globalThis.window === undefined) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveNotas(store: NotasStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function getPartyNotas(partyName: string, seccion: Seccion): Nota[] {
  const store = loadNotas();
  return store[partyName]?.[seccion] ?? [];
}

function setPartyNotas(partyName: string, seccion: Seccion, notas: Nota[]) {
  const store = loadNotas();
  if (!store[partyName]) {
    store[partyName] = { ejes: [], problemas: [], escandalos: [] };
  }
  store[partyName][seccion] = notas;
  saveNotas(store);
}

/* ─── Component ─── */
export default function NotasPersonales({
  partyName,
  seccion,
}: NotasPersonalesProps) {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [open, setOpen] = useState(false);
  const [texto, setTexto] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setNotas(getPartyNotas(partyName, seccion));
    setOpen(false);
    setTexto("");
    setEditingId(null);
  }, [partyName, seccion]);

  const addNota = useCallback(() => {
    if (!texto.trim()) return;

    if (editingId) {
      // Update existing
      const updated = notas.map((n) =>
        n.id === editingId ? { ...n, texto: texto.trim() } : n,
      );
      setNotas(updated);
      setPartyNotas(partyName, seccion, updated);
      setEditingId(null);
    } else {
      // Create new
      const newNota: Nota = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        texto: texto.trim(),
        fecha: new Date().toLocaleString("es-PE", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      const updated = [newNota, ...notas];
      setNotas(updated);
      setPartyNotas(partyName, seccion, updated);
    }
    setTexto("");
  }, [texto, editingId, notas, partyName, seccion]);

  const deleteNota = (id: string) => {
    const updated = notas.filter((n) => n.id !== id);
    setNotas(updated);
    setPartyNotas(partyName, seccion, updated);
  };

  const startEdit = (nota: Nota) => {
    setEditingId(nota.id);
    setTexto(nota.texto);
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTexto("");
  };

  const { emoji, label } = SECCION_LABELS[seccion];

  return (
    <div className="mt-3">
      {/* Toggle button */}
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/60 transition-colors text-left"
      >
        <span className="text-base">📝</span>
        <span className="font-body text-xs font-semibold text-amber-800 flex-1">
          Mis notas — {emoji} {label}
        </span>
        {notas.length > 0 && (
          <span className="bg-amber-200 text-amber-900 text-xs px-1.5 py-0.5 rounded-full font-bold font-body">
            {notas.length}
          </span>
        )}
        <span
          className={`text-amber-600 text-xs transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {/* Expandable panel */}
      {open && (
        <div className="mt-2 space-y-2 animate-fadeIn">
          {/* Input area */}
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe una nota para recordar..."
              rows={2}
              className="flex-1 px-3 py-2 rounded-lg border border-amber-300/60 font-body text-sm text-subtitle bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-400/30 outline-none resize-none transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  addNota();
                }
              }}
            />
            <div className="flex flex-col gap-1">
              <button
                onClick={addNota}
                disabled={!texto.trim()}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-body text-xs font-bold hover:bg-amber-600 transition-colors disabled:opacity-40 flex-1"
              >
                {editingId ? "✓" : "+"}
              </button>
              {editingId && (
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 rounded-lg bg-gray-200 text-gray-600 font-body text-xs hover:bg-gray-300 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Notes list */}
          {notas.length > 0 ? (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {notas.map((nota) => (
                <div
                  key={nota.id}
                  className={`group flex items-start gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    editingId === nota.id
                      ? "bg-amber-50 border-amber-300"
                      : "bg-white border-gray-100 hover:border-amber-200"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-subtitle whitespace-pre-wrap wrap-break-word">
                      {nota.texto}
                    </p>
                    <p className="font-body text-[10px] text-subtitle/40 mt-0.5">
                      {nota.fecha}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => startEdit(nota)}
                      className="p-1 text-subtitle/40 hover:text-amber-600 transition-colors"
                      title="Editar"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteNota(nota.id)}
                      className="p-1 text-subtitle/40 hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-xs text-subtitle/40 text-center py-2">
              Sin notas aún. Escribe algo para recordar.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
