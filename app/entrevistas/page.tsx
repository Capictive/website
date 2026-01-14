"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Nav from "../components/Nav";
import Link from "next/link";
import Image from "next/image";
import { PARTIES } from "../lib/parties";

interface Entrevista {
  id: number;
  entrevista_id: string;
  youtube_id: string;
  // Handle potential space in key from API schema description
  " youtube_id"?: string;
  titulo_ia: string;
  partido: string;
  video_uploaded_at: string;
  hook_ia: string;
}

function EntrevistasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const partidoName = searchParams.get("partido");
  const expediente = searchParams.get("expediente");
  
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Find party metadata from local constant
  const partyMetadata = useMemo(() => {
    if (!partidoName) return null;
    return PARTIES.find(p => p.name.toLowerCase() === partidoName.toLowerCase()) || 
           PARTIES.find(p => p.id === partidoName);
  }, [partidoName]);

  const planGobiernoLink = partyMetadata 
    ? `https://files.capictive.app/Partidos%20Politicos/${encodeURIComponent(partyMetadata.name)}/PLAN%20GOBIERNO.pdf`
    : "#";

  useEffect(() => {
    if (partidoName) {
      setLoading(true);
      setError(null);
      fetch(`https://api.capictive.app/entrevistas?partido=${encodeURIComponent(partidoName)}`)
        .then(res => {
            if (!res.ok) throw new Error("Error al cargar entrevistas");
            return res.json();
        })
        .then(data => {
            let list: Entrevista[] = [];
            if (Array.isArray(data)) list = data;
            else if (data && Array.isArray(data.data)) list = data.data;
            
            // Normalize youtube_id if needed
            list = list.map(item => ({
                ...item,
                youtube_id: item.youtube_id || item[" youtube_id"] || ""
            }));

            setEntrevistas(list);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setError("No se pudieron cargar las entrevistas.");
            setLoading(false);
        });
    }
  }, [partidoName]);

  const selectedEntrevista = expediente 
    ? entrevistas.find(e => e.entrevista_id === expediente)
    : null;

  if (!partidoName) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
             <Image src="/pose/searching.png" alt="Buscar" width={150} height={150} />
             <p className="font-body text-subtitle text-lg">⚠️ No se ha seleccionado un partido.</p>
             <Link href="/partidos" className="btn-primary">Volver a Partidos</Link>
        </div>
    );
  }

  // Helper to extract clean youtube ID
  const getYoutubeId = (urlOrId: string) => {
      if (!urlOrId) return "";
      // If it's already an ID (11 chars, alphanumeric, dash, underscore)
      if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
        return urlOrId;
      }
      // If it looks like a URL, try to extract ID
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = urlOrId.match(regExp);
      return (match && match[2].length === 11) ? match[2] : ""; // Return empty if extraction fails
  };

  const cleanMarkdown = (text: string) => {
    if (!text) return "";
    let clean = text;
    
    // Replace literal escaped newlines that might come from JSON
    clean = clean.replace(/\\n/g, '\n');
    
    // Heuristic: Add newlines before headers if they are missing
    // e.g. "Content ## Header" -> "Content\n\n## Header"
    clean = clean.replace(/([^\n])\s*(#{1,3}\s)/g, '$1\n\n$2');
    
    // Heuristic: Add newlines before numbered lists if missing
    // e.g. "Text 1. Item" -> "Text\n1. Item"
    clean = clean.replace(/([^\n])\s+(\d+\.\s)/g, '$1\n$2');

    return clean;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-button-background-primary"></div>
                <p className="font-body text-subtitle mt-4">Cargando entrevistas...</p>
            </div>
        ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <Link href="/partidos" className="block mt-2 underline">Volver a intentar</Link>
            </div>
        ) : selectedEntrevista ? (
            // ==========================================
            // VISTA DETALLE (Expediente seleccionado)
            // ==========================================
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                
                {/* Navegación Back */}
                <button 
                    onClick={() => router.push(`/entrevistas?partido=${encodeURIComponent(partidoName)}`)}
                    className="btn-secondary flex items-center gap-2 mb-4"
                >
                    ← Volver a la lista
                </button>

                {/* GRID 4 LAYOUT HEADER */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-subtitle/10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                        
                        {/* Col 1 & 2: Logo + Info */}
                        <div className="md:col-span-2 flex items-center gap-6">
                            {partyMetadata?.logo ? (
                                <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 shrink-0">
                                    <Image 
                                        src={partyMetadata.logo} 
                                        alt={partyMetadata.name} 
                                        width={80} 
                                        height={80} 
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl">🏛️</div>
                            )}
                            
                            <div>
                                <h1 className="font-title text-subtitle text-2xl md:text-3xl font-bold leading-tight">
                                    {partyMetadata?.name || partidoName}
                                </h1>
                                {partyMetadata?.candidatos?.presidente && (
                                    <p className="font-body text-subtitle/70 text-lg mt-1">
                                        Candidato: <span className="font-semibold">{partyMetadata.candidatos.presidente}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Col 3 & 4: Actions & Meta */}
                        <div className="md:col-span-2 flex flex-col items-end gap-3 justify-center">
                            <div className="flex flex-wrap gap-3 justify-end">
                                <a 
                                    href={planGobiernoLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn-primary flex items-center gap-2 text-center"
                                >
                                    📄 Plan de Gobierno
                                </a>
                                <a 
                                    href={`https://www.youtube.com/watch?v=${getYoutubeId(selectedEntrevista.youtube_id)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
                                >
                                    ▶ Ver en YouTube
                                </a>
                            </div>
                            <div className="text-right">
                                <span className="inline-block px-3 py-1 bg-gray-100 rounded-md text-xs font-mono text-subtitle/60 border border-gray-200">
                                    Expediente: {selectedEntrevista.entrevista_id}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENIDO MARKDOWN */}
                <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-subtitle/10">
                    <div className="p-6 md:p-10">
                        <div className="prose prose-stone prose-lg max-w-none 
                            prose-headings:font-title prose-headings:text-subtitle 
                            prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6
                            prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                            prose-h3:text-xl prose-h3:font-semibold
                            prose-p:font-body prose-p:text-subtitle/90 prose-p:leading-relaxed
                            prose-strong:font-bold prose-strong:text-subtitle
                            prose-li:font-body prose-li:text-subtitle/90
                            prose-ul:list-disc prose-ol:list-decimal
                            prose-blockquote:border-l-4 prose-blockquote:border-button-background-primary prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                        ">
                             <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    // Override basic elements to ensure styles are applied if prose fails specific inheritance
                                    h1: ({node, ...props}) => <h1 className="font-title text-3xl font-bold text-subtitle mb-4 mt-6" {...props} />,
                                    h2: ({node, ...props}) => <h2 className="font-title text-2xl font-bold text-subtitle mb-3 mt-5" {...props} />,
                                    h3: ({node, ...props}) => <h3 className="font-title text-xl font-bold text-subtitle mb-2 mt-4" {...props} />,
                                    p: ({node, ...props}) => <p className="font-body text-subtitle/90 leading-relaxed mb-4" {...props} />,
                                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                                    li: ({node, ...props}) => <li className="font-body text-subtitle/90 pl-1" {...props} />,
                                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-button-background-primary bg-gray-50 p-4 rounded-r-lg italic text-subtitle/80 my-4" {...props} />,
                                }}
                             >
                                {cleanMarkdown(selectedEntrevista.titulo_ia)}
                             </ReactMarkdown>
                        </div>
                    </div>
                </article>

                {/* IFRAME VIDEO (Fixed) */}
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video w-full max-w-5xl mx-auto border-4 border-gray-900">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${getYoutubeId(selectedEntrevista.youtube_id)}`} 
                        title="YouTube video player" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
            </div>

        ) : (
            // ==========================================
            // VISTA LISTA (Selección de entrevista)
            // ==========================================
            <>
                <div className="mb-8 border-b border-subtitle/20 pb-4">
                    <Link 
                        href="/partidos" 
                        className="font-body text-sm text-subtitle/70 hover:text-button-background-primary flex items-center gap-1 mb-2 transition-colors"
                    >
                        ← Volver a Partidos
                    </Link>
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div>
                            <h1 className="font-title text-subtitle text-3xl md:text-5xl font-extrabold">
                                Entrevistas: <span className="text-button-background-primary">{partyMetadata?.name || partidoName}</span>
                            </h1>
                            <p className="font-body text-subtitle/80 mt-2">
                                Explora las entrevistas y declaraciones más recientes.
                            </p>
                        </div>
                        {partyMetadata?.logo && (
                            <Image 
                                src={partyMetadata.logo} 
                                alt="Logo" 
                                width={80} 
                                height={80} 
                                className="object-contain"
                            />
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {entrevistas.map((e) => (
                        <div 
                            key={e.id} 
                            onClick={() => router.push(`/entrevistas?partido=${encodeURIComponent(partidoName)}&expediente=${e.entrevista_id}`)}
                            className="group bg-white rounded-xl overflow-hidden border border-subtitle/10 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col h-full"
                        >
                             {/* Thumbnail */}
                             <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
                                <img 
                                    src={`https://img.youtube.com/vi/${getYoutubeId(e.youtube_id)}/hqdefault.jpg`} 
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
                                 <h3 className="font-title text-lg font-bold text-subtitle line-clamp-3 mb-2 group-hover:text-button-background-primary transition-colors">
                                    {e.hook_ia || e.titulo_ia?.substring(0, 80) || "Entrevista sin título"}
                                 </h3>
                                 <div className="mt-auto pt-4 border-t border-subtitle/10 flex justify-between items-center">
                                    <span className="font-body text-xs text-subtitle/60 bg-gray-100 px-2 py-1 rounded">
                                        📅 {e.video_uploaded_at || "Reciente"}
                                    </span>
                                    <span className="font-body text-xs font-bold text-button-background-primary group-hover:underline">
                                        Ver Expediente →
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
                                Aún no hemos procesado entrevistas para {partidoName}.
                            </p>
                        </div>
                    )}
                </div>
            </>
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
