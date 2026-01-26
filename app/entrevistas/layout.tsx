import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrevistas y Multimedia",
  description:
    "Recopilación de entrevistas, debates y videos clave de los candidatos y partidos políticos.",
  openGraph: {
    title: "Entrevistas Políticas | Capictive",
    description:
      "Mira lo que dicen los candidatos. Entrevistas y debates recopilados.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
