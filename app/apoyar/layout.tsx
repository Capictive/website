import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apoya el Proyecto",
  description: "Ayúdanos a mantener Capictive activo y libre de publicidad invasiva. Tu apoyo fortalece la democracia informada.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
