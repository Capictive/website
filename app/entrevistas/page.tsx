"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

type Entrevista = {
  id: number;
  created_at?: string;
  entrevista_id?: string;
  " youtube_id"?: string;
  titulo_ia?: string;
  partido?: string;
  video_uploaded_at?: string;
  hook_ia?: string;
};

export default function EntrevistasRootPage() {
  const search = useSearchParams();
  const router = useRouter();
  const partidoParam = search.get("partido") || "";
  const expedienteParam = search.get("expediente") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([]);

  useEffect(() => {
    if (!partidoParam) return;
    setLoading(true);
    setError(null);
    fetch(`https://api.capictive.app/entrevistas?partido=${encodeURIComponent(partidoParam)}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar entrevistas");
        return res.json();
      })
      .then((data) => {
        setEntrevistas(data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [partidoParam]);

  const selected = useMemo(() => {
    if (!expedienteParam) return null;
    return (
      entrevistas.find(
        (e) => e.entrevista_id === expedienteParam || String(e.id) === expedienteParam
      ) || null
    );
  }, [entrevistas, expedienteParam]);

  const onSelect = (e: Entrevista) => {
    const id = e.entrevista_id || String(e.id);
    const url = `/entrevistas?partido=${encodeURIComponent(partidoParam)}&expediente=${encodeURIComponent(id)}`;
    router.push(url);
  };

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="font-title text-4xl text-center mb-6">Entrevista</h1>

      {!partidoParam ? (
        <div className="text-center p-8">
          <p className="font-body">No se especificó partido. Abre desde la ficha del partido: botón "Ver Entrevistas".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left: listado */}
          <aside className="md:col-span-1 space-y-3">
            <div className="bg-white border rounded-lg p-3">
              <p className="font-body text-sm text-gray-500">Entrevistas para:</p>
              <h3 className="font-title text-base mt-1 break-words">{decodeURIComponent(partidoParam)}</h3>
            </div>

            <div className="space-y-2">
              {loading && <div className="font-body">Cargando entrevistas...</div>}
              {error && <div className="font-body text-red-600">{error}</div>}
              {!loading && !error && entrevistas.length === 0 && (
                <div className="font-body">No se encontraron entrevistas.</div>
              )}

              {entrevistas.map((e) => (
                <button
                  key={e.id}
                  onClick={() => onSelect(e)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    (e.entrevista_id === expedienteParam || String(e.id) === expedienteParam)
                      ? "bg-button-background-primary/10 border-button-background-primary"
                      : "border-subtitle hover:border-button-background-primary/40"
                  }`}
                >
                  <p className="font-body font-semibold">{e.hook_ia || "(Sin hook)"}</p>
                  <p className="font-body text-xs text-gray-500 mt-1">{e.created_at}</p>
                </button>
              ))}
            </div>
          </aside>

          {/* Right: detalle */}
          <section className="md:col-span-3 border rounded-lg p-6 bg-white min-h-[320px]">
            {!selected ? (
              <div className="text-center font-body text-gray-600">Selecciona una entrevista para ver el análisis.</div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-title text-2xl">{selected.hook_ia}</h2>
                <div className="prose max-w-none">
                  <ReactMarkdown>{selected.titulo_ia || ""}</ReactMarkdown>
                </div>

                {selected[" youtube_id"] && (
                  <div className="mt-4 aspect-video w-full rounded-lg overflow-hidden border">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${selected[" youtube_id"].trim()}?rel=0&modestbranding=1`}
                      title="Entrevista YouTube"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      className="w-full h-full"
                      style={{ minHeight: 320 }}
                    />
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
