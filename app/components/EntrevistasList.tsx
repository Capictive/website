import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface Entrevista {
  id: number;
  created_at: string;
  entrevista_id: string;
  " youtube_id": string;
  "titulo_ia": string;
  "partido": string;
  "video_uploaded_at": string;
  "hook_ia": string;
}

export default function EntrevistasList({ partido }: { partido: string }) {
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://api.capictive.app/entrevistas?partido=${encodeURIComponent(partido)}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar entrevistas");
        return res.json();
      })
      .then((data) => {
        setEntrevistas(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [partido]);

  if (loading) return <div className="font-body">Cargando entrevistas...</div>;
  if (error) return <div className="font-body text-red-600">{error}</div>;
  if (!entrevistas.length) return <div className="font-body">No hay entrevistas para este partido.</div>;

  return (
    <div className="space-y-6">
      {entrevistas.map((e) => (
        <div key={e.id} className="border rounded-xl p-4 bg-white shadow-md">
          <h3 className="font-title text-xl font-bold mb-2">{e["hook_ia"]}</h3>
          <div className="prose max-w-none mb-4">
            <ReactMarkdown>{e["titulo_ia"]}</ReactMarkdown>
          </div>
          {e[" youtube_id"] && (
            <div className="aspect-video w-full rounded-lg overflow-hidden border">
              <iframe
                src={`https://www.youtube.com/embed/${e[" youtube_id"].trim()}`}
                title="Entrevista YouTube"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
                style={{ minHeight: 220 }}
              ></iframe>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
