"use client";
import React, { useMemo } from "react";

const CATEGORY_COLORS: Record<string, string> = {
  politica: "#ef4444",
  economia: "#3b82f6",
  social: "#10b981",
  general: "#6b7280",
  ambiental: "#22c55e",
  defensa: "#f97316",
  cultura: "#8b5cf6",
  seguridad: "#dc2626",
  tecnologia: "#06b6d4",
};

interface WordItem {
  text: string;
  value: number;
  categoria: string;
}

interface WordcloudPartyData {
  partido: string;
  palabras: WordItem[];
}

interface Props {
  readonly data: WordcloudPartyData[];
  readonly selectedParty: string;
}

export default function WordcloudChart({ data, selectedParty }: Props) {
  const partyData = useMemo(
    () => data.find((d) => d.partido === selectedParty),
    [data, selectedParty],
  );

  const words = useMemo(() => partyData?.palabras ?? [], [partyData]);
  const maxValue = Math.max(
    ...(words.length ? words.map((w) => w.value) : [1]),
  );
  const minValue = Math.min(
    ...(words.length ? words.map((w) => w.value) : [0]),
  );

  // Generar tamaños de fuente proporcionales
  const getFontSize = (value: number) => {
    const range = maxValue - minValue || 1;
    const normalized = (value - minValue) / range;
    return Math.round(12 + normalized * 36); // 12px to 48px
  };

  // Generar rotaciones pseudo-aleatorias pero consistentes
  const getRotation = (index: number) => {
    const rotations = [0, 0, 0, -15, 15, -8, 8, 0, 0, -5, 5];
    return rotations[index % rotations.length];
  };

  // Category counts para la leyenda
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    words.forEach((w) => {
      counts[w.categoria] = (counts[w.categoria] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [words]);

  // Top words
  const topWords = useMemo(
    () => [...words].sort((a, b) => b.value - a.value).slice(0, 10),
    [words],
  );

  if (!partyData) {
    return (
      <div className="text-center py-12 font-body text-subtitle/60">
        No se encontraron datos para este partido.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wordcloud visual */}
      <div className="bg-white rounded-2xl border-2 border-subtitle/20 p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 min-h-75">
          {words.map((word, i) => {
            const fontSize = getFontSize(word.value);
            const rotation = getRotation(i);
            const color =
              CATEGORY_COLORS[word.categoria] ?? CATEGORY_COLORS.general;
            return (
              <span
                key={`${word.text}-${i}`}
                className="inline-block cursor-default transition-all duration-200 hover:scale-110 hover:opacity-100"
                style={{
                  fontSize: `${fontSize}px`,
                  fontWeight:
                    word.value > (maxValue + minValue) / 2 ? 800 : 500,
                  color,
                  opacity: 0.6 + (word.value / maxValue) * 0.4,
                  transform: `rotate(${rotation}deg)`,
                  lineHeight: 1.1,
                  fontFamily: "var(--font-google-sans)",
                }}
                title={`${word.text}: ${word.value} menciones (${word.categoria})`}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      </div>

      {/* Category legend */}
      <div className="flex flex-wrap justify-center gap-3">
        {categoryCounts.map(([cat, count]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: CATEGORY_COLORS[cat] ?? "#999",
              }}
            />
            <span className="text-xs font-body text-subtitle/70 capitalize">
              {cat} ({count})
            </span>
          </div>
        ))}
      </div>

      {/* Top 10 words table */}
      <div className="bg-white rounded-2xl border-2 border-subtitle/20 overflow-hidden shadow-lg">
        <div className="px-4 py-3 bg-button-background-secondary/30 border-b border-subtitle/10">
          <h4 className="font-title text-subtitle text-sm font-bold">
            🔤 Top 10 palabras más mencionadas
          </h4>
        </div>
        <div className="divide-y divide-subtitle/5">
          {topWords.map((w, i) => (
            <div
              key={`top-${w.text}-${i}`}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-button-background-secondary/10 transition-colors"
            >
              <span className="text-lg font-black font-title text-subtitle/30 w-6 text-center">
                {i + 1}
              </span>
              <div className="flex-1">
                <span className="font-body text-sm font-bold text-subtitle">
                  {w.text}
                </span>
                <span
                  className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold capitalize"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[w.categoria] ?? "#999"}15`,
                    color: CATEGORY_COLORS[w.categoria] ?? "#999",
                  }}
                >
                  {w.categoria}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(w.value / maxValue) * 100}%`,
                      backgroundColor: CATEGORY_COLORS[w.categoria] ?? "#999",
                    }}
                  />
                </div>
                <span className="text-xs font-body font-bold text-subtitle/50 w-8 text-right">
                  {w.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
