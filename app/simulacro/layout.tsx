import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulacro de Votación",
  description: "Practica tu voto con nuestra cédula virtual interactiva. Aprende a votar correctamente para las Elecciones 2026.",
  openGraph: {
    title: "Simulacro de Votación 2026 | Capictive",
    description: "Practica con la cédula virtual. Evita el voto nulo o viciado.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
