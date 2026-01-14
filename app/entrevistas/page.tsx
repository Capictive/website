"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import Nav from "../components/Nav";
import Link from "next/link";
import Image from "next/image";

interface Entrevista {
  id: number;
  entrevista_id: string;
  youtube_id: string;
  titulo_ia: string;
  partido: string;
  video_uploaded_at: string;
  hook_ia: string;
}

function EntrevistasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const partido = searchParams.get("partido");
  const expediente = searchParams.get("expediente");
  
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (partido) {
      setLoading(true);
      setError(null);
      // Clean up partido name for display if needed, but API expects what was sent
      fetch(`https://api.capictive.app/entrevistas?partido=${encodeURIComponent(partido)}`)
        .then(res => {
            if (!res.ok) throw new Error("Error al cargar entrevistas");
            return res.json();
        })
        .then(data => {
            if (Array.isArray(data)) setEntrevistas(data);
            else if (data && Array.isArray(data.data)) setEntrevistas(data.data);
            else setEntrevistas([]); 
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setError("No se pudieron cargar las entrevistas.");
            setLoading(false);
        });
    }
  }, [partido]);

  const selectedEntrevista = expediente 
    ? entrevistas.find(e => e.entrevista_id === expediente)
    : null;

  if (!partido) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
             <Image src="/pose/searching.png" alt="Buscar" width={150} height={150} />
             <p className="font-body text-subtitle text-lg">⚠️ No se ha seleccionado un partido.</p>
             <Link href="/partidos" className="btn-primary">Volver a Partidos</Link>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-subtitle/20 pb-4">
            <Link 
                href="/partidos" 
                className="font-body text-sm text-subtitle/70 hover:text-button-background-primary flex items-center gap-1 mb-2 transition-colors"
            >
                ← Volver a Partidos
            </Link>
            <h1 className="font-title text-subtitle text-3xl md:text-5xl font-extrabold">
                Entrevistas: <span className="text-button-background-primary">{partido}</span>
            </h1>
            <p className="font-body text-subtitle/80 mt-2">
                Explora las entrevistas y declaraciones más recientes.
            </p>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-button-background-primary"></div>
                <p className="font-body text-subtitle mt-4">Cargando entrevistas...</p>
            </div>
        ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        ) : selectedEntrevista ? (
            // DETALLE ENTREVISTA
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button 
                    onClick={() => router.push(`/entrevistas?partido=${encodeURIComponent(partido)}`)}
                    className="mb-6 btn-secondary flex items-center gap-2"
                >
                    ← Volver a la lista
                </button>

                <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-subtitle/10">
                    <div className="p-6 md:p-10 space-y-6">
                        {/* Markdown Content */}
                        <div className="prose prose-stone lg:prose-xl max-w-none font-body text-subtitle">
                             <ReactMarkdown components={{
                                h1: ({node, ...props}) => <h1 className="font-title text-subtitle text-3xl font-bold mb-4" {...props} />,
                                h2: ({node, ...props}) => <h2 className="font-title text-subtitle text-2xl font-bold mt-6 mb-3" {...props} />,
                                h3: ({node, ...props}) => <h3 className="font-title text-subtitle text-xl font-bold mt-4 mb-2" {...props} />,
                                p: ({node, ...props}) => <p className="font-body text-subtitle/90 leading-relaxed mb-4" {...props} />,
                                li: ({node, ...props}) => <li className="font-body text-subtitle/90 ml-4" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-bold text-subtitle" {...props} />,
                             }}>
                                {selectedEntrevista.titulo_ia}
                             </ReactMarkdown>
                        </div>
                        
                        {/* Video Section */}
                        <div className="mt-10 pt-10 border-t border-subtitle/10">
                            <h3 className="font-title text-subtitle text-2xl font-bold mb-6 flex items-center gap-2">
                                📺 Video de la entrevista
                            </h3>
                            <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-black aspect-video">
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src={`https://www.youtube.com/embed/${selectedEntrevista.youtube_id}`} 
                                    title="YouTube video player" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    allowFullScreen
                                    className="absolute top-0 left-0 w-full h-full border-0"
                                ></iframe>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="font-body text-sm text-subtitle/60">
                                    Subido el: {selectedEntrevista.video_uploaded_at || "Fecha desconocida"}
                                </p>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        ) : (
            // LISTA DE ENTREVISTAS
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entrevistas.map((e) => (
                    <div 
                        key={e.id} 
                        onClick={() => router.push(`/entrevistas?partido=${encodeURIComponent(partido)}&expediente=${e.entrevista_id}`)}
                        className="group bg-white rounded-xl overflow-hidden border border-subtitle/10 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col h-full"
                    >
                         {/* Thumbnail */}
                         <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
                            <img 
                                src={`https://img.youtube.com/vi/${e.youtube_id}/hqdefault.jpg`} 
                                alt={e.hook_ia}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-all">
                                <div className="w-12 h-12 rounded-full bg-button-background-primary/90 flex items-center justify-center text-white pl-1 shadow-lg group-hover:scale-110 transition-transform">
                                    ▶
                                </div>
                            </div>
                         </div>
                         
                         {/* Card Body */}
                         <div className="p-5 flex-1 flex flex-col">
                             <h3 className="font-title text-lg font-bold text-subtitle line-clamp-2 mb-2 group-hover:text-button-background-primary transition-colors">
                                {e.hook_ia || "Entrevista sin título"}
                             </h3>
                             <div className="mt-auto pt-4 border-t border-subtitle/10 flex justify-between items-center">
                                <span className="font-body text-xs text-subtitle/60 bg-gray-100 px-2 py-1 rounded">
                                    📅 {e.video_uploaded_at || "Reciente"}
                                </span>
                                <span className="font-body text-xs font-bold text-button-background-primary group-hover:underline">
                                    Ver análisis →
                                </span>
                             </div>
                         </div>
                    </div>
                ))}
                
                {entrevistas.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-subtitle/20 rounded-xl bg-gray-50/50">
                        <span className="text-4xl block mb-4">📭</span>
                        <h3 className="font-title text-xl font-bold text-subtitle">No hay entrevistas disponibles</h3>
                        <p className="font-body text-subtitle/70 mt-2">
                            Aún no hemos procesado entrevistas para {partido}.
                        </p>
                    </div>
                )}
            </div>
        )}
    </div>
  );
}

export default function EntrevistasPage() {
    return (
        <main className="min-h-screen bg-primary-background">
            <Nav />
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-button-background-primary"></div>
                </div>
            }>
                <EntrevistasContent />
            </Suspense>
        </main>
    )
}
