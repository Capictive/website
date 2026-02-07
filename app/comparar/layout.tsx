import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparar Partidos",
  description:
    "Compara partidos políticos con gráficos de radar, diagrama de Nolan y nube de palabras.",
};

export default function CompararLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}
