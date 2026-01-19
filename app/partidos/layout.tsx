import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partidos Políticos",
  description: "Explora los partidos políticos para las Elecciones 2026. Conoce sus planes de gobierno, ideología, candidatos y antecedentes.",
  openGraph: {
    title: "Partidos Políticos | Capictive",
    description: "Analiza y compara los partidos políticos del Perú. Información resumida y clara.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
