import EntrevistasClient from "./EntrevistasClient";

export default function EntrevistasRootPage({ searchParams }: { searchParams: { partido?: string; expediente?: string } }) {
  const partidoParam = searchParams?.partido || "";
  const expedienteParam = searchParams?.expediente || "";
  return <EntrevistasClient partidoParam={partidoParam} expedienteParam={expedienteParam} />;
}
