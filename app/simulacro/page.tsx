"use client";

import BallotSheet from "@/app/components/voting/BallotSheet";
import Nav from "@/app/components/Nav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SimulacroPage() {
  return (
    <main className="min-h-screen pb-20 font-body" style={{ backgroundColor: "#f8f5ee" }}>
      <Nav />
      
      <div className="w-full px-4 md:px-8 py-8">
        <div className="mb-6 container mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-bold transition-colors hover:opacity-80"
            style={{ color: "#503224" }}
          >
            <ArrowLeft size={20} />
            Volver al inicio
          </Link>
        </div>

        <div className="text-center mb-10 container mx-auto">
          <h1 className="font-title text-3xl md:text-5xl font-extrabold mb-4" style={{ color: "#8a6957" }}>
            Simulacro de Votación 2026
          </h1>
          <p className="font-body text-base md:text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: "#503224" }}>
            Practica tu voto de manera responsable con nuestra cédula interactiva.
            <br className="hidden md:block"/> Simula la experiencia real antes del domingo de elecciones.
          </p>
        </div>

        {/* Contenedor fluido sin max-w restrictivo en desktop */}
        <div className="w-full">
            <BallotSheet />
        </div>
      </div>
    </main>
  );
}
