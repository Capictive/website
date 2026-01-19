import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidatos al Congreso y Presidencia",
  description: "Busca y filtra candidatos para las Elecciones 2026. Encuentra postulantes por región, partido y cargo.",
  openGraph: {
    title: "Buscador de Candidatos | Capictive",
    description: "Encuentra a tus candidatos ideales. Filtros por departamento, partido y cargo.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
