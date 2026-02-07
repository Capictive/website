"use client";
import React, { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// Colores para cada partido
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

const LABEL_MAP: Record<string, string> = {
  economia: "Economía",
  educacion: "Educación",
  salud: "Salud",
  seguridad: "Seguridad",
  infraestructura: "Infraestructura",
  medioAmbiente: "Medio Ambiente",
  desarrolloSocial: "Desarrollo Social",
  agricultura: "Agricultura",
};

interface RadarPartyData {
  partido: string;
  valores: Record<string, number>;
  analisisDetallado: Record<
    string,
    {
      calificacion: number;
      justificacion: string;
      propuestasDestacadas: string[];
      presupuestoMencionado: boolean;
      metasEspecificas: boolean;
    }
  >;
  top3Prioridades: string[];
  areasDesatendidas: string[];
  perfilIdeologico: string;
}

interface Props {
  readonly data: RadarPartyData[];
  readonly selectedParties: string[];
}

export default function RadarValores({ data, selectedParties }: Props) {
  const [activeDetail, setActiveDetail] = useState<{
    party: string;
    area: string;
  } | null>(null);

  // Filtrar datos por partidos seleccionados
  const filtered = data.filter((d) => selectedParties.includes(d.partido));

  // Construir datos para el radar
  const areas = Object.keys(LABEL_MAP);
  const chartData = areas.map((area) => {
    const row: Record<string, string | number> = {
      area: LABEL_MAP[area],
      areaKey: area,
    };
    filtered.forEach((p) => {
      row[p.partido] = p.valores[area] ?? 0;
    });
    return row;
  });

  const handleAreaClick = (party: string, area: string) => {
    setActiveDetail(
      activeDetail?.party === party && activeDetail?.area === area
        ? null
        : { party, area },
    );
  };

  // Buscar detalle activo
  const detailParty = activeDetail
    ? filtered.find((p) => p.partido === activeDetail.party)
    : null;
  const detailInfo =
    detailParty && activeDetail
      ? detailParty.analisisDetallado[activeDetail.area]
      : null;

  return (
    <div className="space-y-6">
      {/* Radar chart */}
      <div className="bg-white rounded-2xl border-2 border-subtitle/20 p-4 shadow-lg">
        <ResponsiveContainer width="100%" height={420}>
          <RadarChart data={chartData} outerRadius="78%">
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="area"
              tick={{ fill: "#503224", fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              domain={[0, 10]}
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              tickCount={6}
            />
            {filtered.map((p, i) => (
              <Radar
                key={p.partido}
                name={p.partido}
                dataKey={p.partido}
                stroke={COLORS[i % COLORS.length]}
                fill={COLORS[i % COLORS.length]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "12px",
                fontFamily: "var(--font-google-sans)",
              }}
              formatter={(value: number | undefined, name: string | undefined) => [
                `${value ?? 0}/10`,
                name ?? "",
              ]}
            />
            <Legend
              wrapperStyle={{
                fontSize: "12px",
                fontFamily: "var(--font-google-sans)",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla comparativa con clicks */}
      <div className="bg-white rounded-2xl border-2 border-subtitle/20 overflow-hidden shadow-lg">
        <div className="px-4 py-3 bg-button-background-secondary/30 border-b border-subtitle/10">
          <h4 className="font-title text-subtitle text-sm font-bold">
            📊 Puntajes por área (click para detalle)
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-subtitle/10">
                <th className="text-left px-3 py-2 font-body text-subtitle/70 text-xs">
                  Área
                </th>
                {filtered.map((p, i) => (
                  <th
                    key={p.partido}
                    className="text-center px-2 py-2 font-body text-xs font-bold"
                    style={{ color: COLORS[i % COLORS.length] }}
                  >
                    {p.partido}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr
                  key={area}
                  className="border-b border-subtitle/5 hover:bg-button-background-secondary/10 transition-colors"
                >
                  <td className="px-3 py-2 font-body text-subtitle text-xs font-semibold">
                    {LABEL_MAP[area]}
                  </td>
                  {filtered.map((p, i) => {
                    const val = p.valores[area] ?? 0;
                    const isActive =
                      activeDetail?.party === p.partido &&
                      activeDetail?.area === area;
                    return (
                      <td key={p.partido} className="text-center px-2 py-2">
                        <button
                          onClick={() => handleAreaClick(p.partido, area)}
                          className={`inline-flex items-center justify-center w-10 h-7 rounded-md text-xs font-bold transition-all ${
                            isActive
                              ? "ring-2 ring-offset-1 scale-110 shadow-md"
                              : "hover:scale-105"
                          }`}
                          style={{
                            backgroundColor: `${COLORS[i % COLORS.length]}20`,
                            color: COLORS[i % COLORS.length],
                            ...(isActive
                              ? {
                                  ringColor: COLORS[i % COLORS.length],
                                }
                              : {}),
                          }}
                        >
                          {val}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalle */}
      {detailInfo && activeDetail && (
        <div className="bg-white rounded-2xl border-2 border-button-background-primary/30 p-5 shadow-xl animate-scaleIn space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-title text-subtitle text-lg font-bold flex items-center gap-2">
              📋 {LABEL_MAP[activeDetail.area]} — {activeDetail.party}
            </h4>
            <button
              onClick={() => setActiveDetail(null)}
              className="text-subtitle/50 hover:text-subtitle transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="text-3xl font-black font-title"
              style={{ color: "#b9832c" }}
            >
              {detailInfo.calificacion}/10
            </span>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${detailInfo.calificacion * 10}%`,
                  backgroundColor: "#b9832c",
                }}
              />
            </div>
          </div>

          <p className="font-body text-subtitle text-sm leading-relaxed">
            {detailInfo.justificacion}
          </p>

          {detailInfo.propuestasDestacadas?.length > 0 && (
            <div>
              <p className="font-body text-xs font-bold text-subtitle/70 uppercase mb-2">
                Propuestas destacadas:
              </p>
              <ul className="space-y-1.5">
                {detailInfo.propuestasDestacadas.map((prop) => (
                  <li
                    key={prop}
                    className="flex items-start gap-2 font-body text-xs text-subtitle"
                  >
                    <span className="text-green-500 shrink-0">✔</span>
                    {prop}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 text-xs font-body">
            <span
              className={`px-2 py-1 rounded-full ${detailInfo.presupuestoMencionado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {detailInfo.presupuestoMencionado
                ? "✅ Presupuesto"
                : "❌ Sin presupuesto"}
            </span>
            <span
              className={`px-2 py-1 rounded-full ${detailInfo.metasEspecificas ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {detailInfo.metasEspecificas
                ? "✅ Metas claras"
                : "❌ Sin metas"}
            </span>
          </div>
        </div>
      )}

      {/* Perfiles ideológicos */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p, i) => (
            <div
              key={p.partido}
              className="bg-white rounded-2xl border-2 border-subtitle/10 p-4 shadow-md space-y-3"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <h5 className="font-title text-subtitle text-sm font-bold">
                  {p.partido}
                </h5>
              </div>
              <p className="font-body text-xs text-subtitle/80 leading-relaxed">
                {p.perfilIdeologico}
              </p>
              <div className="flex gap-1 flex-wrap">
                <span className="text-[10px] font-body font-bold text-subtitle/60 uppercase">
                  Top 3:
                </span>
                {p.top3Prioridades.map((pri) => (
                  <span
                    key={pri}
                    className="px-1.5 py-0.5 bg-button-background-primary/10 text-button-background-primary rounded text-[10px] font-bold font-body"
                  >
                    {LABEL_MAP[pri] || pri}
                  </span>
                ))}
              </div>
              {p.areasDesatendidas.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  <span className="text-[10px] font-body font-bold text-red-400 uppercase">
                    Débil:
                  </span>
                  {p.areasDesatendidas.map((a) => (
                    <span
                      key={a}
                      className="px-1.5 py-0.5 bg-red-50 text-red-500 rounded text-[10px] font-bold font-body"
                    >
                      {LABEL_MAP[a] || a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
