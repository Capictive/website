"use client";
import React, { useState, useMemo } from "react";

const COLORS = [
  "#b9832c",
  "#ef4444",
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
  "#14b8a6",
];

const CUADRANTE_COLORS: Record<string, string> = {
  liberal: "#3b82f6",
  conservador: "#ef4444",
  progresista: "#10b981",
  totalitario: "#6b7280",
  centro: "#f59e0b",
};

const CUADRANTE_LABELS: Record<string, string> = {
  liberal: "Liberal",
  conservador: "Conservador",
  progresista: "Progresista",
  totalitario: "Totalitario",
  centro: "Centro",
};

interface NolanPartyData {
  nombre: string;
  siglas: string;
  libertadEconomica: number;
  libertadPersonal: number;
  analisis: {
    economico: {
      calificacion: number;
      justificacion: string;
      evidencias: string[];
    };
    personal: {
      calificacion: number;
      justificacion: string;
      evidencias: string[];
    };
  };
  cuadrante: string;
  descripcion: string;
}

interface Props {
  readonly data: NolanPartyData[];
  readonly selectedParties: string[];
}

export default function DiagramaNolan({ data, selectedParties }: Props) {
  const [hoveredParty, setHoveredParty] = useState<string | null>(null);
  const [detailParty, setDetailParty] = useState<string | null>(null);

  const filtered = useMemo(
    () => data.filter((d) => selectedParties.includes(d.nombre)),
    [data, selectedParties],
  );

  const allData = data; // for background dots

  const SIZE = 500;
  const PADDING = 50;
  const INNER = SIZE - PADDING * 2;

  const scaleX = (val: number) => PADDING + (val / 10) * INNER;
  const scaleY = (val: number) => SIZE - PADDING - (val / 10) * INNER;

  const detailData = detailParty
    ? data.find((d) => d.nombre === detailParty)
    : null;

  return (
    <div className="space-y-6">
      {/* Nolan Diagram */}
      <div className="bg-white rounded-2xl border-2 border-subtitle/20 p-4 shadow-lg">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full max-w-137.5 mx-auto"
          style={{ fontFamily: "var(--font-google-sans)" }}
        >
          {/* Background quadrants */}
          <rect
            x={PADDING}
            y={PADDING}
            width={INNER / 2}
            height={INNER / 2}
            fill="#10b98115"
            stroke="#10b98130"
          />
          <rect
            x={PADDING + INNER / 2}
            y={PADDING}
            width={INNER / 2}
            height={INNER / 2}
            fill="#3b82f615"
            stroke="#3b82f630"
          />
          <rect
            x={PADDING}
            y={PADDING + INNER / 2}
            width={INNER / 2}
            height={INNER / 2}
            fill="#6b728015"
            stroke="#6b728030"
          />
          <rect
            x={PADDING + INNER / 2}
            y={PADDING + INNER / 2}
            width={INNER / 2}
            height={INNER / 2}
            fill="#ef444415"
            stroke="#ef444430"
          />

          {/* quadrant labels */}
          <text
            x={PADDING + INNER * 0.25}
            y={PADDING + INNER * 0.15}
            textAnchor="middle"
            fill="#10b981"
            fontSize="11"
            fontWeight="700"
          >
            PROGRESISTA
          </text>
          <text
            x={PADDING + INNER * 0.75}
            y={PADDING + INNER * 0.15}
            textAnchor="middle"
            fill="#3b82f6"
            fontSize="11"
            fontWeight="700"
          >
            LIBERAL
          </text>
          <text
            x={PADDING + INNER * 0.25}
            y={PADDING + INNER * 0.88}
            textAnchor="middle"
            fill="#6b7280"
            fontSize="11"
            fontWeight="700"
          >
            TOTALITARIO
          </text>
          <text
            x={PADDING + INNER * 0.75}
            y={PADDING + INNER * 0.88}
            textAnchor="middle"
            fill="#ef4444"
            fontSize="11"
            fontWeight="700"
          >
            CONSERVADOR
          </text>

          {/* Centro label */}
          <text
            x={SIZE / 2}
            y={SIZE / 2}
            textAnchor="middle"
            fill="#f59e0b"
            fontSize="9"
            fontWeight="600"
            opacity={0.5}
          >
            CENTRO
          </text>

          {/* Grid lines */}
          {[2, 4, 6, 8].map((v) => (
            <React.Fragment key={v}>
              <line
                x1={scaleX(v)}
                y1={PADDING}
                x2={scaleX(v)}
                y2={SIZE - PADDING}
                stroke="#e5e7eb"
                strokeDasharray="3,3"
              />
              <line
                x1={PADDING}
                y1={scaleY(v)}
                x2={SIZE - PADDING}
                y2={scaleY(v)}
                stroke="#e5e7eb"
                strokeDasharray="3,3"
              />
            </React.Fragment>
          ))}

          {/* Axis labels */}
          <text
            x={SIZE / 2}
            y={SIZE - 8}
            textAnchor="middle"
            fill="#503224"
            fontSize="10"
            fontWeight="600"
          >
            Libertad Económica →
          </text>
          <text
            x={12}
            y={SIZE / 2}
            textAnchor="middle"
            fill="#503224"
            fontSize="10"
            fontWeight="600"
            transform={`rotate(-90, 12, ${SIZE / 2})`}
          >
            Libertad Personal →
          </text>

          {/* Axis ticks */}
          {[0, 2, 4, 6, 8, 10].map((v) => (
            <React.Fragment key={v}>
              <text
                x={scaleX(v)}
                y={SIZE - PADDING + 16}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="9"
              >
                {v}
              </text>
              <text
                x={PADDING - 10}
                y={scaleY(v) + 3}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="9"
              >
                {v}
              </text>
            </React.Fragment>
          ))}

          {/* Background dots (all parties, faded) */}
          {allData
            .filter((d) => !selectedParties.includes(d.nombre))
            .map((d) => (
              <circle
                key={d.nombre}
                cx={scaleX(d.libertadEconomica)}
                cy={scaleY(d.libertadPersonal)}
                r={4}
                fill="#d1d5db"
                opacity={0.4}
              />
            ))}

          {/* Selected parties */}
          {filtered.map((d, i) => {
            const isHovered = hoveredParty === d.nombre;
            return (
              <g
                key={d.nombre}
                onMouseEnter={() => setHoveredParty(d.nombre)}
                onMouseLeave={() => setHoveredParty(null)}
                onClick={() =>
                  setDetailParty(detailParty === d.nombre ? null : d.nombre)
                }
                style={{ cursor: "pointer" }}
              >
                {/* Glow effect on hover */}
                {isHovered && (
                  <circle
                    cx={scaleX(d.libertadEconomica)}
                    cy={scaleY(d.libertadPersonal)}
                    r={16}
                    fill={COLORS[i % COLORS.length]}
                    opacity={0.15}
                  />
                )}
                <circle
                  cx={scaleX(d.libertadEconomica)}
                  cy={scaleY(d.libertadPersonal)}
                  r={isHovered ? 9 : 7}
                  fill={COLORS[i % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                  style={{ transition: "r 0.2s" }}
                />
                {/* Label */}
                <text
                  x={scaleX(d.libertadEconomica)}
                  y={scaleY(d.libertadPersonal) - 12}
                  textAnchor="middle"
                  fill={COLORS[i % COLORS.length]}
                  fontSize="9"
                  fontWeight="700"
                >
                  {d.siglas}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip on hover */}
        {hoveredParty && (
          <div className="text-center mt-2 animate-fadeIn">
            <p className="font-body text-xs text-subtitle/80">
              {(() => {
                const p = data.find((d) => d.nombre === hoveredParty);
                if (!p) return "";
                return `${p.nombre} — Econ: ${p.libertadEconomica} | Personal: ${p.libertadPersonal} | ${CUADRANTE_LABELS[p.cuadrante] ?? p.cuadrante}`;
              })()}
            </p>
          </div>
        )}
      </div>

      {/* Leyenda de cuadrantes */}
      <div className="flex flex-wrap justify-center gap-3">
        {Object.entries(CUADRANTE_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: CUADRANTE_COLORS[key] }}
            />
            <span className="text-xs font-body text-subtitle/70">{label}</span>
          </div>
        ))}
      </div>

      {/* SelectedParty chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {filtered.map((d, i) => (
          <button
            key={d.nombre}
            onClick={() =>
              setDetailParty(detailParty === d.nombre ? null : d.nombre)
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-bold border-2 transition-all ${
              detailParty === d.nombre
                ? "shadow-lg scale-105"
                : "hover:scale-105"
            }`}
            style={{
              borderColor: COLORS[i % COLORS.length],
              color: COLORS[i % COLORS.length],
              backgroundColor:
                detailParty === d.nombre
                  ? `${COLORS[i % COLORS.length]}15`
                  : "white",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            {d.siglas}
            <span className="opacity-50">
              ({CUADRANTE_LABELS[d.cuadrante]})
            </span>
          </button>
        ))}
      </div>

      {/* Detail Panel */}
      {detailData && (
        <div className="bg-white rounded-2xl border-2 border-button-background-primary/30 p-5 shadow-xl animate-scaleIn space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-title text-subtitle text-lg font-bold">
              🧭 {detailData.nombre}
            </h4>
            <span
              className="px-2 py-1 rounded-full text-xs font-bold text-white"
              style={{
                backgroundColor:
                  CUADRANTE_COLORS[detailData.cuadrante] ?? "#999",
              }}
            >
              {CUADRANTE_LABELS[detailData.cuadrante] ?? detailData.cuadrante}
            </span>
          </div>

          <p className="font-body text-sm text-subtitle/80 leading-relaxed">
            {detailData.descripcion}
          </p>

          {/* Score bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Economic */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-body font-bold text-subtitle">
                <span>💰 Libertad Económica</span>
                <span>{detailData.libertadEconomica}/10</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{
                    width: `${detailData.libertadEconomica * 10}%`,
                  }}
                />
              </div>
              <p className="font-body text-xs text-subtitle/70 leading-relaxed">
                {detailData.analisis.economico?.justificacion}
              </p>
              {detailData.analisis.economico?.evidencias?.length > 0 && (
                <details className="group">
                  <summary className="text-xs font-body font-semibold text-button-background-primary cursor-pointer">
                    📖 Ver evidencias (
                    {detailData.analisis.economico.evidencias.length})
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {detailData.analisis.economico.evidencias.map((ev) => (
                      <li
                        key={ev}
                        className="font-body text-[11px] text-subtitle/60 italic pl-3 border-l-2 border-blue-200"
                      >
                        {ev}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>

            {/* Personal */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-body font-bold text-subtitle">
                <span>🗽 Libertad Personal</span>
                <span>{detailData.libertadPersonal}/10</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-500"
                  style={{
                    width: `${detailData.libertadPersonal * 10}%`,
                  }}
                />
              </div>
              <p className="font-body text-xs text-subtitle/70 leading-relaxed">
                {detailData.analisis.personal?.justificacion}
              </p>
              {detailData.analisis.personal?.evidencias?.length > 0 && (
                <details className="group">
                  <summary className="text-xs font-body font-semibold text-button-background-primary cursor-pointer">
                    📖 Ver evidencias (
                    {detailData.analisis.personal.evidencias.length})
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {detailData.analisis.personal.evidencias.map((ev) => (
                      <li
                        key={ev}
                        className="font-body text-[11px] text-subtitle/60 italic pl-3 border-l-2 border-green-200"
                      >
                        {ev}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
