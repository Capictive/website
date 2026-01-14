"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const EntrevistasList = dynamic(() => import("../../components/EntrevistasList"), { ssr: false });

export default function EntrevistasPage() {
  const params = useParams();
  const partido = decodeURIComponent((params.partido as string) || "");
  if (!partido) return notFound();
  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="font-title text-4xl text-center mb-8">Entrevista</h1>
      <EntrevistasList partido={partido} />
    </main>
  );
}
