import { notFound } from "next/navigation";
import EntrevistasList from "../components/EntrevistasList";

export const dynamic = 'force-dynamic';

export default function EntrevistasPage({
  searchParams,
}: {
  searchParams: { partido?: string };
}) {
  const partido = decodeURIComponent(searchParams.partido || "");
  if (!partido) return notFound();
  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="font-title text-4xl text-center mb-8">Entrevista</h1>
      <EntrevistasList partido={partido} />
    </main>
  );
}
