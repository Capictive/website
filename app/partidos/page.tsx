"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import Nav from "../components/Nav";
import { PARTIES, Party } from "../lib/parties";

export default function PartidosPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Party | null>(PARTIES[0]);

  const perPage = 5;
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return PARTIES.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(safePage * perPage, safePage * perPage + perPage);

  return (
    <main>
      <Nav />

      {/* Encabezado periódico */}
      <div className="mt-6 py-8 border-y text-center border-subtitle">
        <h1 className="font-title text-subtitle text-6xl font-extrabold">Partidos Políticos</h1>
        <p className="font-body">Explora y compara propuestas de manera simple</p>
      </div>

      {/* Grid principal: lista + detalle */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Lista y filtros */}
        <aside className="col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => {
                setPage(0);
                setQuery(e.target.value);
              }}
              placeholder="Filtrar partidos..."
              className="w-full px-3 py-2 rounded-md border border-subtitle font-body text-subtitle bg-button-background-secondary/30"
            />
          </div>

          {/* Navegación por páginas */}
          <div className="flex items-center justify-between mt-2">
            <button
              className="btn-secondary"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              aria-label="Anterior"
            >
              ←
            </button>
            <span className="font-body text-sm">Página {safePage + 1} de {totalPages}</span>
            <button
              className="btn-secondary"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              aria-label="Siguiente"
            >
              →
            </button>
          </div>

          {/* Lista vertical de 5 */}
          <div className="mt-3">
            <div className="grid grid-cols-1 gap-3">
              {visible.map((p) => (
                <button
                  key={p.id}
                  className={`card rounded-md border w-full text-left ${selected?.id === p.id ? "border-button-background-primary" : "border-subtitle"}`}
                  onClick={() => setSelected(p)}
                >
                  <div className="flex items-center gap-3">
                    <Image src={p.logo} alt={p.name} width={48} height={48} />
                    <span className="font-body text-subtitle">{p.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Detalle del partido seleccionado */}
        <article className="col-span-2 border rounded-md border-subtitle p-6 space-y-6">
          {selected ? (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1 flex flex-col items-center">
                <Image src={selected.logo} alt={selected.name} width={120} height={120} />
                <Image
                  src={selected.candidateImage}
                  alt={`Candidato ${selected.name}`}
                  width={240}
                  height={240}
                  className="mt-4 rounded-md border border-subtitle object-cover aspect-square w-full max-w-[240px]"
                />
              </div>
              <div className="col-span-2 space-y-3">
                <h2 className="font-title text-subtitle text-4xl font-bold">{selected.name}</h2>
                <p className="font-body">{selected.description}</p>
                <div className="flex gap-3">
                  <button className="btn-primary">Ver propuesta</button>
                  <button className="btn-secondary">Comparar</button>
                </div>
              </div>
            </div>
          ) : (
            <p className="font-body">Selecciona un partido para ver detalles.</p>
          )}
        </article>
      </section>
    </main>
  );
}
