"use client";

import React, { useState, useRef, useEffect } from "react";
// Eliminamos next/image dentro de la cédula para evitar problemas de captura
import { mockParties, PoliticalParty } from "@/app/data/mockParties";
import {
  Share2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  Eye,
} from "lucide-react";
import { toPng } from "html-to-image";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type VoteType =
  | "president"
  | "senatorsNational"
  | "senatorsUniverse"
  | "deputies"
  | "andean";

interface VoteSelection {
  partyId: string | null;
  preferences?: { box1: string; box2: string };
}

interface BallotState {
  president: VoteSelection;
  senatorsNational: VoteSelection;
  senatorsUniverse: VoteSelection;
  deputies: VoteSelection;
  andean: VoteSelection;
}

// --- SVG Assets (Color Safe - HEX ONLY) ---
const HandwrittenX = () => (
  <svg
    viewBox="0 0 100 100"
    className="absolute inset-0 w-full h-full pointer-events-none z-20 p-2"
  >
    <path
      d="M 15 15 L 85 85 M 85 15 L 15 85"
      stroke="#000000"
      strokeWidth="12"
      fill="none"
      strokeLinecap="round"
      style={{ filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.2))" }}
    />
  </svg>
);

const CrossMark = () => (
  <svg
    viewBox="0 0 100 100"
    className="absolute inset-0 w-full h-full pointer-events-none z-20 p-2"
  >
    <path
      d="M 50 10 L 50 90 M 10 50 L 90 50"
      stroke="#000000"
      strokeWidth="12"
      fill="none"
      strokeLinecap="round"
      style={{ filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.2))" }}
    />
  </svg>
);

export default function BallotSheet() {
  const ballotRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [votes, setVotes] = useState<BallotState>({
    president: { partyId: null },
    senatorsNational: { partyId: null, preferences: { box1: "", box2: "" } },
    senatorsUniverse: { partyId: null, preferences: { box1: "", box2: "" } },
    deputies: { partyId: null, preferences: { box1: "", box2: "" } },
    andean: { partyId: null, preferences: { box1: "", box2: "" } },
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleVote = (type: VoteType, partyId: string) => {
    setVotes((prev) => {
      if (prev[type].partyId === partyId) {
        return { ...prev, [type]: { ...prev[type], partyId: null } };
      }
      return { ...prev, [type]: { ...prev[type], partyId } };
    });
  };

  const handlePreference = (
    type: VoteType,
    partyId: string,
    box: "box1" | "box2",
    value: string,
  ) => {
    if (votes[type].partyId !== partyId && value) {
      handleVote(type, partyId);
    }
    if (!/^\d*$/.test(value)) return;

    setVotes((prev) => ({
      ...prev,
      [type]: {
        partyId,
        preferences: {
          ...prev[type].preferences!,
          [box]: value.slice(0, 2),
        },
      },
    }));
  };

  const exportBallot = async () => {
    // Si estamos viendo el resumen, capturamos el resumen. Si no, la cédula completa.
    const elementToCapture = showSummary
      ? summaryRef.current
      : ballotRef.current;

    if (!elementToCapture) return;
    setIsExporting(true);

    try {
      // 1. Marca de agua
      const watermark = document.createElement("div");
      watermark.id = "temp-watermark";
      Object.assign(watermark.style, {
        padding: "16px",
        backgroundColor: "#ffffff",
        borderTop: "2px solid #000000",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "12px",
        color: "#4b5563",
        fontFamily: "var(--font-google-sans)",
      });
      watermark.innerText = `Simulación 2026 - Capictive • ${new Date().toLocaleDateString()}`;
      elementToCapture.appendChild(watermark);

      // 2. Configuración robusta para toPng
      const dataUrl = await toPng(elementToCapture, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        // Asegurar dimensiones correctas para evitar cortes
        width: elementToCapture.scrollWidth,
        height: elementToCapture.scrollHeight,
        style: {
          // Forzar transformación nula para evitar offsets raros en móvil
          transform: "none",
          margin: "0",
          // Asegurar que se vea todo
          maxHeight: "none",
          maxWidth: "none",
        },
        filter: (node) => node.tagName !== "BUTTON", // Ignorar botones
      });

      // 3. Limpieza
      elementToCapture.removeChild(watermark);

      // 4. Descarga
      const link = document.createElement("a");
      link.download = `voto-capictive-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error exporting:", err);
      const wm = elementToCapture.querySelector("#temp-watermark");
      if (wm) elementToCapture.removeChild(wm);
      alert("Error al generar imagen. Intente nuevamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const steps = [
    { id: "president", title: "Presidente", bg: "#e2e8f0" },
    { id: "senatorsNational", title: "Senadores Nac.", bg: "#ffe4e6" },
    { id: "senatorsUniverse", title: "Senadores Dist.", bg: "#ffe4e6" },
    { id: "deputies", title: "Diputados", bg: "#ffedd5" },
    { id: "andean", title: "Parla. Andino", bg: "#e5e7eb" },
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowSummary(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- COMPONENTE DE RESUMEN (Shared) ---
  const renderSummary = () => (
    <div className="w-full pb-24">
      <div className="flex justify-center">
        <div
          ref={summaryRef}
          className="p-6 shadow-xl relative font-body bg-white"
          style={{
            // Dimensiones fijas mínimas para evitar colapsos
            minWidth: "320px",
            maxWidth: "480px",
            width: "100%",
            fontFamily: "var(--font-google-sans)",
            backgroundColor: "#ffffff",
            color: "#000000",
            border: "2px solid #000000",
            boxSizing: "border-box",
          }}
        >
          {/* Header con Logo */}
          <div
            className="flex items-center justify-between pb-4 mb-4"
            style={{ borderBottom: "2px solid #000000" }}
          >
            <div className="flex-1">
              <h2
                className="text-xl font-black uppercase font-title"
                style={{ color: "#000000", margin: 0, lineHeight: 1.2 }}
              >
                RESUMEN DE VOTO
              </h2>
              <p
                className="text-xs font-bold uppercase font-body"
                style={{ color: "#4b5563", margin: 0 }}
              >
                Elecciones 2026
              </p>
            </div>
            <div className="w-12 h-12 relative flex-shrink-0">
              {/* IMG Nativa */}
              <img
                src="/capictive.png"
                alt="Capictive"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step, idx) => {
              const vote = votes[step.id as VoteType];
              const party = mockParties.find((p) => p.id === vote.partyId);

              return (
                <div
                  key={step.id}
                  style={{
                    border: "1px solid #000000",
                    backgroundColor: step.bg,
                    padding: "8px",
                  }}
                >
                  <h3
                    className="font-bold text-[10px] uppercase mb-2 font-title"
                    style={{ color: "#000000", margin: "0 0 4px 0" }}
                  >
                    {step.title}
                  </h3>
                  {party ? (
                    <div
                      className="flex items-center gap-2 p-2"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        border: "1px solid #000000",
                      }}
                    >
                      {/* Logo Partido */}
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          position: "relative",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={party.logo}
                          alt="logo"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Nombre + Votos */}
                      <div
                        style={{
                          flex: 1,
                          overflow: "hidden",
                          marginLeft: "8px",
                        }}
                      >
                        <p
                          className="font-bold text-xs leading-tight uppercase font-body"
                          style={{ color: "#000000", margin: 0 }}
                        >
                          {party.name}
                        </p>

                        {(vote.preferences?.box1 || vote.preferences?.box2) && (
                          <div className="flex gap-1 mt-1">
                            {vote.preferences.box1 && (
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "20px",
                                  height: "20px",
                                  border: "1px solid #000000",
                                  textAlign: "center",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                  lineHeight: "18px",
                                  color: "#000000",
                                  fontFamily: "var(--font-google-sans)",
                                }}
                              >
                                {vote.preferences.box1}
                              </span>
                            )}
                            {vote.preferences.box2 && (
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "20px",
                                  height: "20px",
                                  border: "1px solid #000000",
                                  textAlign: "center",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                  lineHeight: "18px",
                                  color: "#000000",
                                  fontFamily: "var(--font-google-sans)",
                                }}
                              >
                                {vote.preferences.box2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Check Icon */}
                      <div style={{ color: "#16a34a", width: "20px" }}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#16a34a"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="p-2 text-center text-xs italic font-body"
                      style={{
                        backgroundColor: "#ffffff",
                        border: "1px dashed #9ca3af",
                        color: "#6b7280",
                      }}
                    >
                      Voto Viciado / Blanco
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Visual footer for capture */}
          <div
            className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase font-bold border-t pt-3 font-body"
            style={{ borderColor: "#000000", color: "#6b7280" }}
          >
            <div className="w-4 h-4 relative opacity-50">
              <img
                src="/capictive.png"
                alt="Capictive"
                className="w-full h-full object-contain"
              />
            </div>
            <span>Generado en Capictive.app</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#e7e0d7] flex gap-3 z-50 shadow-lg">
        <button
          onClick={() => setShowSummary(false)}
          className="flex-1 py-3 bg-[#e7e0d7]  cursor-pointer font-bold text-[#8a6957] rounded-xl flex justify-center items-center gap-2"
        >
          <RotateCcw size={18} /> Volver
        </button>
        <button
          onClick={exportBallot}
          className="flex-[2] py-3 bg-[#b9832c] cursor-pointer text-white font-bold rounded-xl flex justify-center items-center gap-2 shadow-lg"
        >
          <Share2 size={18} /> DESCARGAR
        </button>
      </div>
    </div>
  );

  // --- RENDER PRINCIPAL ---

  if (showSummary) {
    return renderSummary();
  }

  // --- HEADER HELPER ---
  const ColumnHeader = ({
    title,
    subtitle,
    bgHex,
  }: {
    title: string;
    subtitle?: string;
    bgHex: string;
  }) => (
    <div
      className="flex flex-col items-center justify-center min-h-[90px]"
      style={{
        borderBottom: "2px solid #000000",
        padding: "8px",
        backgroundColor: bgHex,
        textAlign: "center",
      }}
    >
      <h3
        className="font-title font-bold text-sm md:text-base leading-tight uppercase tracking-tight"
        style={{ color: "#000000", margin: 0 }}
      >
        {title}
      </h3>
      {subtitle && (
        <p
          className="font-body text-[9px] md:text-[10px] leading-tight mt-1 font-medium"
          style={{ color: "#000000", margin: 0 }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );

  return (
    <div className="w-full font-sans">
      {/* Mobile Steps Indicator */}
      <div className="lg:hidden mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-[#e7e0d7]">
        <span className="font-title font-bold text-[#8a6957]">
          {steps[activeStep].title}
        </span>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                i === activeStep ? "bg-[#b9832c]" : "bg-[#e7e0d7]",
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop Controls */}
      <div className="hidden lg:flex mb-6 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-[#e7e0d7]">
        <div>
          <h2 className="font-bold text-[#8a6957] font-title text-xl">
            Simulacro Virtual
          </h2>
          <p className="text-sm text-[#503224] font-body">
            Completa la cédula haciendo clic en los recuadros
          </p>
        </div>
        <div className="flex gap-3">
          {/* New Desktop Summary Button */}
          <button
            onClick={() => setShowSummary(true)}
            className="flex items-center gap-2 cursor-pointer bg-[#e7e0d7] text-[#8a6957] px-6 py-3 rounded-full hover:opacity-90 transition-colors font-bold shadow-sm"
          >
            <Eye size={18} /> Ver Resumen
          </button>
          <button
            onClick={exportBallot}
            disabled={isExporting}
            className="flex items-center gap-2 cursor-pointer text-white px-6 py-3 rounded-full hover:opacity-90 transition-colors font-bold shadow-lg transform duration-100 disabled:opacity-50"
            style={{ backgroundColor: "#b9832c" }}
          >
            {isExporting ? (
              <span className="animate-pulse">...</span>
            ) : (
              <>
                <Share2 size={18} /> GUARDAR CÉDULA
              </>
            )}
          </button>
        </div>
      </div>

      {/* Ballot Grid Container */}
      <div
        ref={ballotRef}
        className={cn(
          "mx-auto relative shadow-2xl font-body",
          isMobile ? "w-full" : "",
        )}
        style={{
          border: "2px solid #000000",
          backgroundColor: "#ffffff",
          color: "#000000",
          boxSizing: "border-box",
          fontFamily: "var(--font-google-sans)",
        }}
      >
        {/* Header - USANDO IMG NATIVO */}
        <div
          style={{
            borderBottom: "2px solid #000000",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f9fafb",
          }}
        >
          <div className="w-14 h-14 md:w-20 md:h-20 flex items-center justify-center relative">
            <img
              src="/escudo_peru.png"
              alt="Escudo Nacional"
              className="w-full h-full object-contain"
            />
          </div>
          <div style={{ flex: 1, margin: "0 8px", textAlign: "center" }}>
            <h1
              className="text-xl md:text-3xl font-black tracking-widest uppercase mb-1 font-title"
              style={{ color: "#000000", margin: 0 }}
            >
              CÉDULA DE SUFRAGIO
            </h1>
            <p
              className="text-xs md:text-sm font-bold uppercase font-body"
              style={{ color: "#4b5563", margin: 0 }}
            >
              Elecciones Generales 2026
            </p>
          </div>
          <div className="w-14 h-14 md:w-20 md:h-20 relative flex items-center justify-center">
            <img
              src="/capictive.png"
              alt="Capictive"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            textAlign: "center",
            fontSize: "12px",
            fontWeight: "bold",
            padding: "4px 0",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Anexo N° 2 (Anverso)
        </div>

        {/* --- THE GRID --- */}
        <div
          className="grid grid-cols-1 lg:grid-cols-5"
          style={{
            display: isMobile ? "flex" : "grid",
            flexDirection: "column",
          }}
        >
          {/* COLUMN 1: PRESIDENTE */}
          <div
            className={cn(
              "flex-col",
              isMobile && activeStep !== 0 ? "hidden" : "flex",
            )}
            style={{ borderRight: isMobile ? "none" : "2px solid #000000" }}
          >
            <ColumnHeader
              title="PRESIDENTE Y VICEPRESIDENTES"
              subtitle="MARQUE CON UNA CRUZ (+) O UN ASPA (X)"
              bgHex="#e2e8f0"
            />
            <div className="flex-1" style={{ backgroundColor: "#ffffff" }}>
              {mockParties.map((party, idx) => {
                const isSelected = votes.president.partyId === party.id;
                return (
                  <div
                    key={`pres-${party.id}`}
                    className="flex lg:flex-col items-stretch cursor-pointer relative transition-colors"
                    style={{
                      borderBottom:
                        idx === mockParties.length - 1
                          ? "none"
                          : "1px solid #000000",
                      height: isMobile ? "112px" : "150px",
                      backgroundColor: isSelected ? "#FFF9C4" : "#ffffff",
                    }}
                    onClick={() => handleVote("president", party.id)}
                  >
                    {/* NAME SECTION */}
                    <div
                      className="flex items-center justify-start p-3 overflow-hidden  lg:justify-center lg:text-center lg:border-r-0 lg:border-b"
                      style={{
                        flex: isMobile ? 1 : "0 0 12px",
                        borderRight: isMobile ? "1px solid #000000" : "none",
                        borderBottom: isMobile ? "none" : "1px solid #000000",
                      }}
                    >
                      <span
                        className="font-bold leading-tight p-2 uppercase font-body"
                        style={{
                          color: "#000000",
                          fontSize: isMobile ? "14px" : "10px",
                          display: "-webkit-box",
                          WebkitLineClamp: isMobile ? 4 : 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {party.name}
                      </span>
                    </div>

                    {/* IMAGES SECTION */}
                    <div className="flex flex-1 relative">
                      <div
                        className="relative flex items-center justify-center overflow-hidden "
                        style={{
                          width: isMobile ? "96px" : "50%",
                          borderRight: "1px solid #000000",
                          backgroundColor: isSelected
                            ? "transparent"
                            : "#f3f4f6",
                        }}
                      >
                        {party.portrait ? (
                          <div className="absolute inset-0 w-full h-full">
                            <img
                              src={party.portrait}
                              alt="foto"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <span style={{ fontSize: "9px", color: "#9ca3af" }}>
                            FOTO
                          </span>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <HandwrittenX />
                          </div>
                        )}
                      </div>
                      <div
                        className="relative flex items-center justify-center p-2 overflow-hidden"
                        style={{
                          width: isMobile ? "96px" : "50%",
                        }}
                      >
                        <div className="absolute inset-0 w-full h-full mt-3">
                          <img
                            src={party.logo}
                            alt="symbol"
                            className="w-full h-4/5 object-contain"
                          />
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <CrossMark />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LEGISLATIVE COLUMNS */}
          {[
            {
              id: "senatorsNational",
              title: "SENADORES NAC.",
              type: "senatorsNational",
            },
            {
              id: "senatorsUniverse",
              title: "SENADORES DIST.",
              type: "senatorsUniverse",
            },
            { id: "deputies", title: "DIPUTADOS", type: "deputies" },
            { id: "andean", title: "PARL. ANDINO", type: "andean" },
          ].map((col, colIdx) => {
            const isActive = isMobile ? activeStep === colIdx + 1 : true;
            return (
              <div
                key={col.id}
                className={cn("flex-col", isActive ? "flex" : "hidden")}
                style={{
                  borderRight:
                    isMobile || colIdx === 3 ? "none" : "2px solid #000000",
                }}
              >
                <ColumnHeader
                  title={col.title}
                  subtitle={
                    col.id === "deputies"
                      ? "MARQUE Y ESCRIBA"
                      : "VOTO PREFERENCIAL"
                  }
                  bgHex={
                    col.id === "deputies"
                      ? "#ffedd5"
                      : col.id === "andean"
                        ? "#e5e7eb"
                        : "#ffe4e6"
                  }
                />
                <div className="flex-1" style={{ backgroundColor: "#ffffff" }}>
                  {mockParties.map((party, idx) => (
                    <LegislativeRow
                      key={`${col.id}-${party.id}`}
                      party={party}
                      voteType={col.type as VoteType}
                      currentVote={votes[col.type as VoteType]}
                      onVote={handleVote}
                      onPreference={handlePreference}
                      isLast={idx === mockParties.length - 1}
                      isSelected={
                        votes[col.type as VoteType].partyId === party.id
                      }
                      isMobile={isMobile}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Navigation Footer (Sticky) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#e7e0d7] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 flex gap-3">
        <button
          onClick={handlePrev}
          disabled={activeStep === 0 && !showSummary}
          className="flex-1 py-3 px-4 rounded-xl font-bold text-[#8a6957] bg-[#e7e0d7] disabled:opacity-50 flex justify-center items-center gap-2"
        >
          <ArrowLeft size={20} />
          Atrás
        </button>

        <button
          onClick={handleNext}
          className="flex-[2] py-3 px-4 rounded-xl font-bold text-white bg-[#b9832c] shadow-lg flex justify-center items-center gap-2"
        >
          {activeStep === 4 ? "Ver Resumen" : "Siguiente"}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

// Sub-component for legislative rows
const LegislativeRow = ({
  party,
  voteType,
  currentVote,
  onVote,
  onPreference,
  isLast,
  isSelected,
  isMobile,
}: {
  party: PoliticalParty;
  voteType: VoteType;
  currentVote: VoteSelection;
  onVote: (t: VoteType, id: string) => void;
  onPreference: (
    t: VoteType,
    id: string,
    box: "box1" | "box2",
    val: string,
  ) => void;
  isLast: boolean;
  isSelected: boolean;
  isMobile: boolean;
}) => {
  return (
    <div
      className="flex items-stretch transition-colors"
      style={{
        borderBottom: isLast ? "none" : "1px solid #000000",
        height: isMobile ? "112px" : "150px",
        backgroundColor: isSelected ? "#FFF9C4" : "#ffffff",
      }}
    >
      {/* Name Cell - ONLY VISIBLE ON MOBILE */}
      {isMobile && (
        <div
          className="flex-1 p-2 flex items-center justify-start overflow-hidden"
          style={{ borderRight: "1px solid #000000", cursor: "pointer" }}
          onClick={() => onVote(voteType, party.id)}
        >
          <span
            className="font-bold leading-tight uppercase font-body"
            style={{
              color: "#000000",
              fontSize: "14px",
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {party.name}
          </span>
        </div>
      )}

      {/* Symbol Cell */}
      <div
        className="relative flex items-center justify-center p-2 hover:bg-yellow-50"
        style={{
          width: isMobile ? "96px" : "50%",
          flex: isMobile ? "none" : 1,
          borderRight: "1px solid #000000",
          cursor: "pointer",
        }}
        onClick={() => onVote(voteType, party.id)}
      >
        <div
          className="relative"
          style={{
            width: isMobile ? "100%" : "80%",
            height: isMobile ? "100%" : "80%",
          }}
        >
          <img
            src={party.logo}
            alt="symbol"
            className="w-full h-full object-contain"
          />
        </div>
        {isSelected && <CrossMark />}
      </div>

      {/* Preference Boxes Cell (HORIZONTAL) */}
      <div
        className="flex items-center justify-center gap-2 p-1"
        style={{
          width: isMobile ? "100px" : "50%",
          flex: isMobile ? "none" : 1,
          backgroundColor: isSelected ? "transparent" : "#f9fafb",
          flexDirection: "row",
        }}
      >
        <input
          type="text"
          maxLength={2}
          value={isSelected ? currentVote.preferences?.box1 : ""}
          onChange={(e) =>
            onPreference(voteType, party.id, "box1", e.target.value)
          }
          className="text-center font-bold focus:outline-none focus:bg-yellow-100 font-body"
          style={{
            width: isMobile ? "32px" : "40px",
            height: isMobile ? "32px" : "40px",
            fontSize: isMobile ? "14px" : "18px",
            border: "1px solid #000000",
            backgroundColor: "#ffffff",
            color: "#000000",
            borderRadius: 0,
            fontFamily: "var(--font-google-sans)",
          }}
        />
        <input
          type="text"
          maxLength={2}
          value={isSelected ? currentVote.preferences?.box2 : ""}
          onChange={(e) =>
            onPreference(voteType, party.id, "box2", e.target.value)
          }
          className="text-center font-bold focus:outline-none focus:bg-yellow-100 font-body"
          style={{
            width: isMobile ? "32px" : "40px",
            height: isMobile ? "32px" : "40px",
            fontSize: isMobile ? "14px" : "18px",
            border: "1px solid #000000",
            backgroundColor: "#ffffff",
            color: "#000000",
            borderRadius: 0,
            fontFamily: "var(--font-google-sans)",
          }}
        />
      </div>
    </div>
  );
};
