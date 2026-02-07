"use client";
import React, { useState, useRef, useMemo } from "react";
import { toPng } from "html-to-image";
import { PARTIES, Party } from "@/app/lib/parties";

interface BlockedPartiesSheetProps {
  readonly blockedParties: string[];
  readonly onUnblock: (partyName: string) => void;
}

export default function BlockedPartiesSheet({
  blockedParties,
  onUnblock,
}: BlockedPartiesSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [gridCols, setGridCols] = useState(5);
  const [isExporting, setIsExporting] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  // Mapa name → Party para los logos
  const blockedData = useMemo(() => {
    return blockedParties
      .map((name) => PARTIES.find((p) => p.name === name))
      .filter(Boolean) as Party[];
  }, [blockedParties]);

  if (blockedParties.length === 0) return null;

  const handleExport = async () => {
    if (!captureRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(captureRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#1a1a1a",
        width: captureRef.current.scrollWidth,
        height: captureRef.current.scrollHeight,
        style: {
          transform: "none",
          margin: "0",
        },
        filter: (node) => {
          // Excluir botones de la captura
          if (node instanceof HTMLElement && node.dataset.noCap === "true")
            return false;
          return true;
        },
      });
      const link = document.createElement("a");
      link.download = `por-estos-no-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error exporting blocked sheet:", err);
      alert("Error al generar imagen. Intente nuevamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const gridColsMap: Record<number, string> = {
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };
  const gridClass = gridColsMap[gridCols] ?? "grid-cols-5";

  return (
    <div className="w-full">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 text-sm font-body text-button-background-primary hover:underline mx-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        🚫 Ver partidos bloqueados ({blockedParties.length})
      </button>

      {/* Animated sliding sheet */}
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: isOpen ? "2000px" : "0px",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(-20px)",
        }}
      >
        <div className="mt-4 border-2 border-subtitle rounded-2xl bg-white shadow-xl overflow-hidden">
          {/* Barra de controles */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-button-background-secondary/40 border-b border-subtitle/20">
            {/* Grid personalizable */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-body text-subtitle/70">
                Columnas:
              </span>
              {[3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setGridCols(n)}
                  className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                    gridCols === n
                      ? "bg-button-background-primary text-white shadow-md scale-110"
                      : "bg-white text-subtitle border border-subtitle/30 hover:border-button-background-primary"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Botón descargar */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="btn-primary text-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              {isExporting ? (
                <span className="animate-spin">⏳</span>
              ) : (
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              )}
              Descargar imagen
            </button>
          </div>

          {/* Área captureable */}
          <div ref={captureRef}>
            {/* Header de la imagen */}
            <div className="text-center py-5 px-4">
              <h3
                className="text-2xl sm:text-3xl font-black font-title tracking-tight"
                style={{
                  color: "#ef4444",
                  fontFamily: "var(--font-playpen-sans)",
                }}
              >
                #POR ESTOS NO 🚫
              </h3>
              <p
                className="text-xs mt-1 font-body"
                style={{
                  color: "#9ca3af",
                  fontFamily: "var(--font-google-sans)",
                }}
              >
                Elecciones 2026
              </p>
            </div>

            {/* Grid de partidos bloqueados */}
            <div className={`grid ${gridClass} gap-3 px-4 pb-5`}>
              {blockedData.map((party) => (
                <div
                  key={party.id}
                  className="relative group flex flex-col items-center"
                >
                  {/* Card del partido */}
                  <div
                    className="w-full aspect-square rounded-xl flex items-center justify-center p-2 relative overflow-hidden"
                    style={{}}
                  >
                    {/* Logo */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={party.logo}
                      alt={party.name}
                      className="w-4/5 h-4/5 object-contain"
                      style={{ filter: "grayscale(30%)" }}
                    />
                    {/* Overlay prohibido 🚫 */}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ pointerEvents: "none" }}
                    >
                      <svg
                        viewBox="0 0 100 100"
                        className="w-3/4 h-3/4"
                        style={{ opacity: 0.55 }}
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="7"
                        />
                        <line
                          x1="22"
                          y1="22"
                          x2="78"
                          y2="78"
                          stroke="#ef4444"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    {/* Botón quitar (no se captura) */}
                    <button
                      data-no-cap="true"
                      onClick={() => onUnblock(party.name)}
                      className="absolute top-1 right-1 w-6 h-6 bg-white/90 text-subtitle rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-100 hover:text-red-600"
                      title="Desbloquear"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Nombre debajo */}
                  <p
                    className="text-[9px] md:text-base mt-1 text-center font-body font-bold leading-tight line-clamp-2"
                    style={{
                      fontFamily: "var(--font-google-sans)",
                    }}
                  >
                    {party.name}
                  </p>
                </div>
              ))}
            </div>

            {/* Watermark */}
            <div
              className="text-center py-2 px-4"
              style={{
                borderTop: "1px solid #333",
              }}
            >
              <p
                className="text-[10px] font-body"
                style={{
                  color: "#6b7280",
                  fontFamily: "var(--font-google-sans)",
                }}
              >
                Capictive • capictive.app • {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
