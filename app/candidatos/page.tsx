"use client";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import Nav from "../components/Nav";
import { useApiLimit, ApiLimitNotification } from "../lib/useApiLimit";

const GEO_URL =
  "https://raw.githubusercontent.com/juaneladio/peru-geojson/master/peru_departamental_simple.geojson";

// API Base URL
const API_BASE_URL = "https://candidates.capictive.app";

// Mapeo de logos de partidos políticos
const logoMap: Record<string, string> = {
  "Ahora Nación": "/political parties/ahora_nacion_logo.png",
  "Alianza Electoral Venceremos": "/political parties/alianza_electoral_venceremos_logo.jpg",
  "Alianza Fuerza y Libertad": "/political parties/alianza_fuerza_y_libertad_logo.png",
  "Alianza Para el Progreso": "/political parties/alianza_para_el_progreso_logo.png",
  "Alianza Unidad Nacional": "/political parties/alianza_unidad_nacional_logo.jpg",
  "Avanza País": "/political parties/avanza_pais_logo.png",
  "Cooperación Popular": "/political parties/cooperacion_popular_logo.png",
  "Fe en el Perú": "/political parties/fe_en_el_peru_logo.png",
  "Frente de la Esperanza": "/political parties/frente_de_la_esperanza_logo.png",
  "Fuerza Popular": "/political parties/fuerza_popular_logo.png",
  "Integridad Democrática": "/political parties/integrida_democratica_logo.jpg",
  "Juntos por el Perú": "/political parties/juntos_por_el_peru_logo.png",
  "Libertad Popular": "/political parties/libertad_popular_logo.jpg",
  "Partido Aprista Peruano": "/political parties/partido_aprista_peruano_logo.png",
  "Partido Cívico Obras": "/political parties/partido_civico_obras_logo.png",
  "Partido de los Trabajadores y Emprendedores PTE - PERU": "/political parties/partido_de_los_trabajadores_y_emprendedores_pte_-_peru_logo.jpg",
  "Partido del Buen Gobierno": "/political parties/partido_del_buen_gobierno_logo.jpg",
  "Partido Democrático Federal": "/political parties/partido_democratico_federal_logo.png",
  "Partido Demócrata Unido Perú": "/political parties/partido_democrata_unido_peru_logo.jpg",
  "Partido Demócrata Verde": "/political parties/partido_democrata_verde_logo.png",
  "Partido Morado": "/political parties/partido_morado_logo.png",
  "Partido Patriótico del Perú": "/political parties/partido_patriotico_del_peru_logo.png",
  "Partido Político PRIN": "/political parties/partido_politico_prin_logo.png",
  "País para todos": "/political parties/pais_para_todos_logo.png",
  "Perú Acción": "/political parties/peru_accion_logo.png",
  "Perú Libre": "/political parties/peru_libre_logo.png",
  "Perú Moderno": "/political parties/peru_moderno_logo.jpg",
  "Perú Primero": "/political parties/peru_primero_logo_2.png",
  "Podemos Perú": "/political parties/podemos_peru_logo.png",
  "Progresemos": "/political parties/progresemos_logo.jpg",
  "Renovación Popular": "/political parties/renovacion_popular_logo.png",
  "Salvemos al Perú": "/political parties/salvemos_al_peru_logo.png",
  "SiCreo": "/political parties/sicreo_logo.png",
  "Somos Perú": "/political parties/somos_peru_logo.svg",
  "Un Camino Diferente": "/political parties/un_camino_diferente_logo.jpg",
};

// Lista de partidos disponibles
const PARTIDOS_DISPONIBLES = Object.keys(logoMap);

// Opciones de cargo
const CARGO_OPTIONS = [
  {
    label: "Todos los cargos",
    value: "",
  },
  {
    label: "Fórmula Presidencial",
    value: "PRESIDENTE DE LA REPÚBLICA,PRIMER VICEPRESIDENTE DE LA REPÚBLICA,SEGUNDO VICEPRESIDENTE DE LA REPÚBLICA",
  },
  {
    label: "Senador",
    value: "SENADOR",
  },
  {
    label: "Diputado",
    value: "DIPUTADO",
  },
  {
    label: "Parlamento Andino",
    value: "REPRESENTANTE ANTE EL PARLAMENTO ANDINO",
  },
];

// Interfaz de candidato de la API
interface Candidato {
  id: number;
  nombreCompleto: string;
  partido: string;
  cargo: string;
  numeroCandidato: number | null;
  postulaDepartamento: string | null;
  resumenHoja: string | null;
  resumenAntecedente: string | null;
  experienciaPolitica: number;
  experienciaCongreso: number;
  createdAt: string;
}

interface ApiResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  filters: {
    postulaDepartamentos: string[];
    includeNullPostulaDepartamento: boolean;
    partidos: string[];
    cargos: string[];
  };
  data: Candidato[];
}

interface PartidoAgrupado {
  nombre: string;
  logo?: string;
  candidatos: Candidato[];
}

// Helper para obtener el color de relleno
const getFillColor = (isSelected: boolean, isNacional: boolean): string => {
  if (isSelected) return "#b9832c";
  if (isNacional) return "#d4a84b";
  return "#e7e0d7";
};

// Mapeo de imágenes para cada paso del tour
const TOUR_IMAGES: Record<number, string> = {
  0: "/pose/searching.png",  // Bienvenida
  1: "/pose/reading.png",    // Filtro cargo
  2: "/pose/reading.png",    // Filtro partidos
  3: "/pose/searching.png",  // Mapa
  4: "/pose/giveme.png",     // Nacional
  5: "/pose/sending.png",    // Extranjero
  6: "/pose/reading.png",    // Panel candidatos
  7: "/pose/lost.png",       // Peticiones
};

// Mapeo de audios para cada paso del tour
const TOUR_AUDIOS: Record<number, string> = {
  0: "/audios/candidatos/1.mp3",
  1: "/audios/candidatos/2.mp3",
  2: "/audios/candidatos/3.mp3",
  3: "/audios/candidatos/4.mp3",
  4: "/audios/candidatos/5.mp3",
  5: "/audios/candidatos/6.mp3",
  6: "/audios/candidatos/7.mp3",
  7: "/audios/candidatos/8.mp3",
};

// Pasos del tour (definidos fuera del componente)
const TOUR_STEPS: Step[] = [
  {
    target: "body",
    content: "¡Bienvenido a la página de Candidatos! Te guiaremos para que conozcas todas las funcionalidades. 🎉",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: ".tour-filtro-cargo",
    content: "Aquí puedes filtrar por tipo de cargo: Fórmula Presidencial, Senador, Diputado o Parlamento Andino.",
    placement: "bottom",
  },
  {
    target: ".tour-filtro-partidos",
    content: "Selecciona uno o varios partidos políticos para ver solo sus candidatos.",
    placement: "bottom",
  },
  {
    target: ".tour-mapa",
    content: "Haz clic en cualquier departamento del mapa para ver los candidatos de esa región.",
    placement: "left",
  },
  {
    target: ".tour-btn-nacional",
    content: "Este botón muestra los candidatos a nivel Nacional (como la Fórmula Presidencial).",
    placement: "top",
  },
  {
    target: ".tour-btn-extranjero",
    content: "Este botón muestra los candidatos para Residentes en el Extranjero.",
    placement: "top",
  },
  {
    target: ".tour-panel-candidatos",
    content: "Aquí aparecerán los candidatos según tus filtros. ¡Haz clic en uno para ver más detalles!",
    placement: "left",
  },
  {
    target: ".tour-peticiones",
    content: "Recuerda que tienes 100 consultas diarias. ¡Úsalas sabiamente! 📊",
    placement: "bottom",
  },
];

// Componente de tooltip personalizado para Joyride
interface CustomTooltipProps {
  continuous: boolean;
  index: number;
  step: Step;
  backProps: React.HTMLAttributes<HTMLButtonElement>;
  primaryProps: React.HTMLAttributes<HTMLButtonElement>;
  skipProps: React.HTMLAttributes<HTMLButtonElement>;
  tooltipProps: React.HTMLAttributes<HTMLDivElement>;
  isLastStep: boolean;
}

const CustomTooltip = ({ 
  continuous, 
  index, 
  step, 
  backProps, 
  primaryProps, 
  skipProps,
  tooltipProps,
  isLastStep 
}: CustomTooltipProps) => (
  <div 
    {...tooltipProps}
    className="bg-white rounded-2xl shadow-2xl p-0 max-w-sm overflow-hidden"
  >
    {/* Imagen del paso */}
    {TOUR_IMAGES[index] && (
      <div className="bg-linear-to-br from-button-background-primary/20 to-button-background-secondary flex justify-center py-4">
        <Image
          src={TOUR_IMAGES[index]}
          alt="Tour illustration"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>
    )}
    
    {/* Contenido */}
    <div className="p-5">
      {step.title && (
        <h3 className="font-title text-subtitle text-lg font-bold mb-2">
          {step.title}
        </h3>
      )}
      <p className="font-body text-subtitle/80 text-sm leading-relaxed">
        {step.content}
      </p>
      
      {/* Indicador de progreso */}
      <div className="flex gap-1 mt-4 mb-3">
        {TOUR_STEPS.map((_, i) => (
          <div
            key={`step-${i}`}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= index ? "bg-button-background-primary" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      
      {/* Botones */}
      <div className="flex items-center justify-between mt-4">
        <button
          {...skipProps}
          className="text-xs font-body text-gray-400 hover:text-gray-600 transition-colors"
        >
          Saltar tour
        </button>
        
        <div className="flex gap-2">
          {index > 0 && (
            <button
              {...backProps}
              className="px-3 py-1.5 text-sm font-body text-subtitle hover:bg-gray-100 rounded-lg transition-colors"
            >
              Atrás
            </button>
          )}
          {continuous && (
            <button
              {...primaryProps}
              className="px-4 py-1.5 text-sm font-body font-bold bg-button-background-primary text-white rounded-lg hover:bg-button-background-primary/90 transition-colors"
            >
              {isLastStep ? "¡Listo!" : "Siguiente"}
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default function CandidatosPage() {
  const router = useRouter();
  
  // Hook de límite de API
  const {
    remainingRequests,
    canMakeRequest,
    consumeRequest,
    isWarning,
    isCritical,
    isExhausted,
  } = useApiLimit();

  // Estados para filtros
  const [selectedCargo, setSelectedCargo] = useState<string>("");
  const [selectedPartidos, setSelectedPartidos] = useState<string[]>([]); // Los partidos realmente aplicados
  const [partidosDraft, setPartidosDraft] = useState<string[]>([]); // Los partidos seleccionados en el dropdown
  const [showPartidosDropdown, setShowPartidosDropdown] = useState(false);
  
  // Estados para departamento/región
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isNacional, setIsNacional] = useState<boolean>(false);
  const [isExtranjero, setIsExtranjero] = useState<boolean>(false);
  
  // Estados para datos de API
  // Eliminado: masterCandidatos ya no se usa
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Constante para paginación local
  // Eliminado: PAGE_SIZE ya no se usa

  // Estado del tour
  const [runTour, setRunTour] = useState<boolean>(false);
  const [tourCompleted, setTourCompleted] = useState<boolean>(false);
  
  // Ref para el audio del tour
  const tourAudioRef = useRef<HTMLAudioElement | null>(null);

  // Función para reproducir audio del tour
  const playTourAudio = useCallback((stepIndex: number) => {
    // Detener audio anterior si existe
    if (tourAudioRef.current) {
      tourAudioRef.current.pause();
      tourAudioRef.current.currentTime = 0;
    }
    
    const audioSrc = TOUR_AUDIOS[stepIndex];
    if (audioSrc) {
      tourAudioRef.current = new Audio(audioSrc);
      tourAudioRef.current.volume = 0.7;
      tourAudioRef.current.play().catch(err => console.log("Audio autoplay blocked:", err));
    }
  }, []);

  // Detener audio cuando se cierra el tour
  const stopTourAudio = useCallback(() => {
    if (tourAudioRef.current) {
      tourAudioRef.current.pause();
      tourAudioRef.current.currentTime = 0;
      tourAudioRef.current = null;
    }
  }, []);

  // Verificar si es la primera visita
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("candidatos-tour-completed");
    if (!hasSeenTour) {
      // Esperar un momento para que la página cargue
      const timer = setTimeout(() => setRunTour(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setTourCompleted(true);
    }
  }, []);

  // Callback del tour
  const handleTourCallback = (data: CallBackProps) => {
    const { status, index, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    // Reproducir audio cuando cambia el paso
    if (type === "step:after" || type === "tour:start") {
      const nextIndex = type === "tour:start" ? 0 : index + 1;
      if (nextIndex < TOUR_STEPS.length) {
        playTourAudio(nextIndex);
      }
    }
    
    // Reproducir audio del primer paso al iniciar
    if (type === "tour:start") {
      playTourAudio(0);
    }
    
    if (finishedStatuses.includes(status)) {
      stopTourAudio();
      setRunTour(false);
      setTourCompleted(true);
      localStorage.setItem("candidatos-tour-completed", "true");
    }
  };

  // Reiniciar tour
  const restartTour = () => {
    setRunTour(true);
  };

  // Función para construir la URL de la API (con paginación)
  const buildApiUrl = useCallback(() => {
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());

    // Filtro de cargo
    if (selectedCargo) {
      params.append("cargo", selectedCargo);
    }

    // Filtro de departamento
    if (isNacional) {
      params.append("postulaDepartamento", "Nacional");
    } else if (isExtranjero) {
      params.append("postulaDepartamento", "RESIDENTES EN EL EXTRANJERO");
    } else if (selectedRegion) {
      params.append("postulaDepartamento", selectedRegion);
    }

    return `${API_BASE_URL}/candidatos?${params.toString()}`;
  }, [currentPage, selectedCargo, selectedRegion, isNacional, isExtranjero]);

  // Estado para los candidatos de la página actual
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filtrar candidatos por partidos seleccionados (localmente, solo en la página actual)
  const candidatosFiltrados = useMemo(() => {
    if (selectedPartidos.length === 0) {
      return candidatos;
    }
    return candidatos.filter(c => selectedPartidos.includes(c.partido));
  }, [candidatos, selectedPartidos]);

  // Fetch de candidatos de la página actual
  const fetchCandidatos = useCallback(async () => {
    if (!canMakeRequest) {
      setError("Has agotado tus consultas de hoy. ¡Apoya al creador para seguir usando la plataforma!");
      router.push("/apoyar");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const consumed = consumeRequest();
      if (!consumed) {
        setError("Has agotado tus consultas de hoy.");
        router.push("/apoyar");
        return;
      }
      const url = buildApiUrl();
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error al cargar los candidatos");
      }
      const data: ApiResponse = await response.json();
      setCandidatos(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setCandidatos([]);
    } finally {
      setLoading(false);
    }
  }, [buildApiUrl, canMakeRequest, consumeRequest, router]);

  // Efecto para cargar datos cuando cambian los filtros principales (no partidos)
  useEffect(() => {
    fetchCandidatos();
  }, [fetchCandidatos]);

  // Reset de página cuando cambian los filtros principales (no partidos)
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCargo, selectedRegion, isNacional, isExtranjero]);

  // Cuando se aplican los partidos (al cerrar el dropdown), recargar la página 1
  useEffect(() => {
    setCurrentPage(1);
    fetchCandidatos();
  }, [selectedPartidos]);

  // Handler para cambio de cargo
  const handleCargoChange = (cargo: string) => {
    setSelectedCargo(cargo);
    // Si es Fórmula Presidencial, activar automáticamente Nacional
    if (cargo === "PRESIDENTE DE LA REPÚBLICA,PRIMER VICEPRESIDENTE DE LA REPÚBLICA,SEGUNDO VICEPRESIDENTE DE LA REPÚBLICA") {
      setIsNacional(true);
      setIsExtranjero(false);
      setSelectedRegion(null);
    }
  };

  // Toggle partido en la selección draft o real según estado del dropdown
  const togglePartido = (partido: string) => {
    if (showPartidosDropdown) {
      setPartidosDraft(prev =>
        prev.includes(partido)
          ? prev.filter(p => p !== partido)
          : [...prev, partido]
      );
    } else {
      setSelectedPartidos(prev =>
        prev.includes(partido)
          ? prev.filter(p => p !== partido)
          : [...prev, partido]
      );
    }
  };

  // Limpiar todos los partidos seleccionados (solo draft)
  const clearPartidos = () => {
    setPartidosDraft([]);
  };

  // Al abrir el dropdown, sincronizar draft con los partidos aplicados
  useEffect(() => {
    if (showPartidosDropdown) {
      setPartidosDraft(selectedPartidos);
    }
  }, [showPartidosDropdown, selectedPartidos]);

  // Al cerrar el dropdown, aplicar los partidos seleccionados
  const handleClosePartidosDropdown = () => {
    setShowPartidosDropdown(false);
    setSelectedPartidos(partidosDraft);
  };

  // Corroborar candidato en JNE
  const handleCorroborar = async (nombreCompleto: string) => {
    // Copiar nombre al portapapeles
    try {
      await navigator.clipboard.writeText(nombreCompleto);
      // Mostrar notificación de copiado
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 font-body text-sm';
      notification.textContent = '✓ Nombre copiado al portapapeles';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
    // Abrir página del JNE
    window.open('https://plataformaelectoral.jne.gob.pe/candidatos/busqueda/buscar', '_blank');
  };

  // Seleccionar región del mapa
  const handleRegionClick = (depName: string) => {
    setIsNacional(false);
    setIsExtranjero(false);
    setSelectedRegion(depName);
  };

  // Toggle Nacional (null)
  const handleNacionalClick = () => {
    setIsNacional(!isNacional);
    setIsExtranjero(false);
    setSelectedRegion(null);
  };

  // Toggle Extranjero
  const handleExtranjeroClick = () => {
    setIsExtranjero(!isExtranjero);
    setIsNacional(false);
    setSelectedRegion(null);
  };

  // Limpiar selección de ubicación
  const clearUbicacion = () => {
    setSelectedRegion(null);
    setIsNacional(false);
    setIsExtranjero(false);
  };

  // Agrupar candidatos por partido (usando los filtrados de la página actual)
  const candidatosPorPartido = useMemo<PartidoAgrupado[]>(() => {
    const grupos: Record<string, PartidoAgrupado> = {};
    candidatosFiltrados.forEach((c) => {
      if (!grupos[c.partido]) {
        grupos[c.partido] = {
          nombre: c.partido,
          logo: logoMap[c.partido],
          candidatos: [],
        };
      }
      grupos[c.partido].candidatos.push(c);
    });
    return Object.values(grupos);
  }, [candidatosFiltrados]);

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  // Función para renderizar el panel de candidatos
  const renderCandidatosPanel = () => {
    // Estado de carga
    if (loading) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-button-background-primary mb-4"></div>
          <p className="font-body text-subtitle/60">Cargando candidatos...</p>
        </div>
      );
    }

    // Error
    if (error) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <p className="text-6xl mb-4">⚠️</p>
          <h3 className="font-title text-red-600 text-xl font-bold">Error</h3>
          <p className="font-body text-subtitle/60 mt-2">{error}</p>
          <button onClick={fetchCandidatos} className="btn-secondary mt-4">
            Reintentar
          </button>
        </div>
      );
    }

    // Sin filtros seleccionados
    if (!selectedRegion && !isNacional && !isExtranjero) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <p className="text-6xl mb-4">🗺️</p>
          <h3 className="font-title text-subtitle text-xl font-bold">
            Selecciona una ubicación
          </h3>
          <p className="font-body text-subtitle/60 mt-2">
            Haz clic en un departamento del mapa, o usa los botones de Nacional 🏛️ o Extranjero 🌍
          </p>
        </div>
      );
    }

    // Sin resultados
    if (candidatosPorPartido.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <p className="text-6xl mb-4">📭</p>
          <h3 className="font-title text-subtitle text-xl font-bold">
            {isNacional ? "Nacional" : isExtranjero ? "Residentes en el Extranjero" : selectedRegion}
          </h3>
          <p className="font-body text-subtitle/60 mt-2">
            No hay candidatos con los filtros seleccionados
          </p>
          <button onClick={clearUbicacion} className="btn-secondary mt-4 z-50">
            Limpiar selección
          </button>
        </div>
      );
    }

    return (
      <>
        {/* Título de la ubicación seleccionada */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-subtitle/20">
          <div>
            <h2 className="font-title text-subtitle text-2xl font-bold">
              {isNacional ? "🏛️ Nacional" : isExtranjero ? "🌍 Residentes en el Extranjero" : selectedRegion}
            </h2>
            <p className="font-body text-subtitle/60 text-sm mt-1">
              {candidatosFiltrados.length} candidato{candidatosFiltrados.length !== 1 ? "s" : ""} encontrado{candidatosFiltrados.length !== 1 ? "s" : ""}
              {selectedPartidos.length > 0 && ` (de ${total} total)`}
            </p>
          </div>
          <button
            onClick={clearUbicacion}
            className="text-subtitle/60 hover:text-subtitle transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Lista de partidos y candidatos */}
        <div className="space-y-4">
          {candidatosPorPartido.map((partido) => (
            <div key={partido.nombre}>
              {/* Header del partido */}
              <div className="flex bg-black/60 rounded-lg text-white py-2 px-3 items-center gap-3 mb-3">
                {partido.logo ? (
                  <div className="w-8 h-8 relative shrink-0">
                    <Image
                      src={partido.logo}
                      alt={`Logo ${partido.nombre}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full shrink-0 bg-gray-400" />
                )}
                <h3 className="font-body font-bold">
                  {partido.nombre}
                </h3>
              </div>

              {/* Candidatos del partido */}
              <div className="space-y-2">
                {partido.candidatos.map((candidato) => (
                  <button
                    key={candidato.id}
                    onClick={() => setSelectedCandidato(candidato)}
                    className="w-full flex items-center justify-between bg-white/60 hover:bg-white rounded-xl px-4 py-3 border border-subtitle/10 hover:border-button-background-primary/50 hover:shadow-md transition-all duration-200 group text-left"
                  >
                    <div>
                      <span className="font-body text-subtitle group-hover:text-button-background-primary transition-colors block">
                        {candidato.nombreCompleto}
                      </span>
                      <span className="font-body text-subtitle/50 text-xs">
                        {candidato.cargo}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {candidato.experienciaPolitica === 1 && (
                        <span className="text-lg" title="Experiencia política">
                          ⚖️
                        </span>
                      )}
                      {candidato.experienciaCongreso === 1 && (
                        <span className="text-lg" title="Experiencia en Congreso">
                          🏛️
                        </span>
                      )}
                      {candidato.resumenAntecedente && (
                        <span className="text-lg" title="Antecedentes">
                          ⚠️
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Leyenda de iconos */}
        <div className="mt-6 pt-4 border-t border-subtitle/20">
          <p className="text-sm font-body text-subtitle/60 mb-2">Iconos:</p>
          <div className="flex flex-wrap gap-4 text-sm font-body text-subtitle/80">
            <span>⚖️ Exp. política</span>
            <span>🏛️ Exp. Congreso</span>
            <span>⚠️ Antecedentes</span>
          </div>
        </div>
      </>
    );
  };

  return (
    <main>
      {/* Tour guiado */}
      <Joyride
        steps={TOUR_STEPS}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        callback={handleTourCallback}
        tooltipComponent={CustomTooltip}
        floaterProps={{
          styles: {
            arrow: {
              color: "#fff",
            },
          },
        }}
        styles={{
          options: {
            overlayColor: "rgba(80, 50, 36, 0.5)",
            zIndex: 10000,
          },
        }}
      />

      {/* Notificación de límite de API */}
      <ApiLimitNotification
        remainingRequests={remainingRequests}
        isWarning={isWarning}
        isCritical={isCritical}
        isExhausted={isExhausted}
        onSupportClick={() => router.push("/apoyar")}
      />

      <Nav />

      {/* Botones discretos de apoyo y compartir */}
      <div className="flex justify-between py-3">
        <a
          href="https://wa.me/?text=%C2%A1Mira%20esta%20p%C3%A1gina%20para%20informarte%20sobre%20las%20elecciones%202026%21%20%F0%9F%97%B3%EF%B8%8F%20https%3A%2F%2Fcapictive.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-body underline p-1 hover:bg-transparent text-subtitle hover:text-green-600 transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Compartir
        </a>
        <a
          href="/apoyar"
          className="text-sm font-body text-subtitle font-bold hover:text-button-background-primary transition-colors flex items-center gap-1"
        >
          ❤️ Apoyar la página
        </a>
      </div>

      {/* Header */}
      <div className="py-8 border-y text-center border-subtitle">
        <h1 className="font-title text-subtitle text-4xl sm:text-5xl md:text-6xl font-extrabold">
          Candidatos
        </h1>
        <p className="font-body">Conoce quienes nos van a representar</p>
        {/* Contador de peticiones restantes */}
        <p className="tour-peticiones font-body text-subtitle/50 text-sm mt-2">
          📊 {remainingRequests} consultas restantes hoy
        </p>
        {/* Botón para reiniciar tour */}
        {tourCompleted && (
          <button
            onClick={restartTour}
            className="mt-2 text-xs font-body text-button-background-primary hover:underline"
          >
            🎯 Ver tutorial nuevamente
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="mt-6 bg-white/40 rounded-2xl border border-subtitle/20 p-4">
        <h3 className="font-title text-subtitle font-bold mb-4">Filtros</h3>
        <div className="flex flex-wrap gap-4">
          {/* Select de Cargo */}
          <div className="tour-filtro-cargo flex-1 min-w-[200px]">
            <label className="block text-sm font-body text-subtitle/70 mb-1">Cargo</label>
            <select
              value={selectedCargo}
              onChange={(e) => handleCargoChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-subtitle/20 bg-white font-body text-subtitle focus:outline-none focus:border-button-background-primary"
            >
              {CARGO_OPTIONS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown de Partidos */}
          <div className="tour-filtro-partidos flex-1 min-w-[200px] relative">
            <label className="block text-sm font-body text-subtitle/70 mb-1">Partidos</label>
            <button
              onClick={() => setShowPartidosDropdown(true)}
              className="w-full px-4 py-2 rounded-lg border border-subtitle/20 bg-white font-body text-subtitle text-left flex items-center justify-between focus:outline-none focus:border-button-background-primary"
            >
              <span className={selectedPartidos.length === 0 ? "text-subtitle/50" : ""}>
                {selectedPartidos.length === 0
                  ? "Todos los partidos"
                  : `${selectedPartidos.length} seleccionado${selectedPartidos.length > 1 ? "s" : ""}`}
              </span>
              <svg className={`w-4 h-4 transition-transform ${showPartidosDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Dropdown content */}
            {showPartidosDropdown && (
              <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-subtitle/20 rounded-lg shadow-lg">
                <div className="sticky top-0 bg-white border-b border-subtitle/10 p-2 flex justify-between items-center">
                  <button
                    onClick={clearPartidos}
                    className="text-xs text-button-background-primary z-50 hover:underline font-body"
                  >
                    Limpiar selección
                  </button>
                  <button
                    onClick={handleClosePartidosDropdown}
                    className="text-xs text-button-background-primary hover:underline font-body ml-2"
                  >
                    Cerrar
                  </button>
                </div>
                {PARTIDOS_DISPONIBLES.map((partido) => (
                  <label
                    key={partido}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={partidosDraft.includes(partido)}
                      onChange={() => togglePartido(partido)}
                      className="w-4 h-4 text-button-background-primary rounded focus:ring-button-background-primary"
                    />
                    {logoMap[partido] && (
                      <div className="w-5 h-5 relative shrink-0">
                        <Image
                          src={logoMap[partido]}
                          alt={partido}
                          fill
                          className="object-contain -z-10"
                        />
                      </div>
                    )}
                    <span className="font-body text-sm text-subtitle truncate">{partido}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chips de partidos seleccionados */}
        {selectedPartidos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedPartidos.map((partido) => (
              <span
                key={partido}
                className="inline-flex items-center gap-1 px-3 py-1 bg-button-background-primary/10 text-button-background-primary rounded-full text-sm font-body"
              >
                {partido}
                <button
                  onClick={() => {
                    if (showPartidosDropdown) {
                      setPartidosDraft(prev => prev.filter(p => p !== partido));
                    } else {
                      setSelectedPartidos(prev => prev.filter(p => p !== partido));
                    }
                  }}
                  className="hover:text-red-500 ml-1"
                  aria-label={`Eliminar ${partido}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div
        className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
        onMouseMove={handleMouseMove}
      >
        {/* Mapa */}
        <div className="tour-mapa bg-white/40 rounded-2xl border border-subtitle/20 p-4 relative overflow-hidden">
          {/* Botones de Nacional y Extranjero */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleNacionalClick}
              className={`tour-btn-nacional flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm transition-all ${
                isNacional
                  ? "bg-button-background-primary text-white shadow-md"
                  : "bg-white/70 text-subtitle hover:bg-white border border-subtitle/20"
              }`}
            >
              <span className="text-lg">🏛️</span>
              <span>Nacional</span>
            </button>
            <button
              onClick={handleExtranjeroClick}
              className={`tour-btn-extranjero flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm transition-all ${
                isExtranjero
                  ? "bg-button-background-primary text-white shadow-md"
                  : "bg-white/70 text-subtitle hover:bg-white border border-subtitle/20"
              }`}
            >
              <span className="text-lg">🌍</span>
              <span>Extranjero</span>
            </button>
          </div>

          <div className="aspect-square lg:aspect-auto lg:h-[550px] w-full">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 1800,
                center: [-75.5, -9.5],
              }}
              style={{ width: "100%", height: "100%" }}
            >
              {/* Filtros SVG para efectos */}
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#503224" floodOpacity="0.4" />
                </filter>
                {/* Filtro de pulso animado para región seleccionada */}
                <filter id="selected-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feFlood floodColor="#b9832c" floodOpacity="0.6" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <ZoomableGroup>
                <Geographies geography={GEO_URL}>
                  {({ geographies }: { geographies: Array<{ rsmKey: string; properties: { NOMBDEP: string } }> }) =>
                    geographies.map((geo) => {
                      const depName = geo.properties.NOMBDEP;
                      const isSelected = selectedRegion === depName;
                      const isHovered = hoveredRegion === depName;
                      const fillColor = getFillColor(isSelected, isNacional);
                      
                      // Determinar clase CSS para animación
                      const getRegionClass = () => {
                        if (isSelected) return "region-selected";
                        if (isHovered) return "region-hover";
                        return "";
                      };

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          className={getRegionClass()}
                          onMouseEnter={() => setHoveredRegion(depName)}
                          onMouseLeave={() => setHoveredRegion(null)}
                          onClick={() => handleRegionClick(depName)}
                          style={{
                            default: {
                              fill: fillColor,
                              stroke: isSelected ? "#503224" : "#8a6957",
                              strokeWidth: isSelected ? 2 : 0.5,
                              outline: "none",
                              filter: isSelected ? "url(#selected-glow)" : "none",
                              transition: "all 0.3s ease-in-out",
                            },
                            hover: {
                              fill: isSelected ? "#a67526" : "#b9832c",
                              stroke: "#503224",
                              strokeWidth: 1.5,
                              outline: "none",
                              cursor: "pointer",
                              filter: "url(#glow)",
                              transition: "all 0.2s ease-in-out",
                            },
                            pressed: {
                              fill: "#8a6520",
                              outline: "none",
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>

          {/* Tooltip del mapa */}
          {hoveredRegion && (
            <div
              className="fixed z-50 pointer-events-none bg-subtitle text-white px-3 py-2 rounded-lg shadow-lg font-body text-sm"
              style={{
                left: tooltipPosition.x + 15,
                top: tooltipPosition.y - 10,
              }}
            >
              {hoveredRegion}
            </div>
          )}

          {/* Leyenda */}
          <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 shadow-md">
            <p className="text-xs font-body text-subtitle/70 mb-2">Leyenda:</p>
            <div className="flex items-center gap-2 text-xs font-body">
              <span className="w-4 h-4 rounded bg-button-background-primary"></span>
              <span>Seleccionado</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-body mt-1">
              <span className="w-4 h-4 rounded bg-[#d4a84b] border border-subtitle/30"></span>
              <span>Nacional</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-body mt-1">
              <span className="w-4 h-4 rounded bg-[#e7e0d7] border border-subtitle/30"></span>
              <span>Departamento</span>
            </div>
          </div>
        </div>

        {/* Panel de candidatos */}
        <div className="tour-panel-candidatos bg-white/40 rounded-2xl border border-subtitle/20 p-4 lg:max-h-[700px] overflow-y-auto">
          {renderCandidatosPanel()}
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-white/50 text-subtitle font-body font-bold hover:bg-button-background-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ←
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-lg font-body font-bold transition-colors ${
                  currentPage === pageNum
                    ? "bg-button-background-primary text-white"
                    : "bg-white/50 text-subtitle hover:bg-button-background-secondary"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-white/50 text-subtitle font-body font-bold hover:bg-button-background-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            →
          </button>
          
          <span className="ml-4 text-sm font-body text-subtitle/60">
            Página {currentPage} de {totalPages}
          </span>
        </div>
      )}

      {/* Modal de detalle del candidato */}
      {selectedCandidato && (
        <dialog
          open
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 m-0 max-w-none max-h-none w-full h-full"
          onClick={() => setSelectedCandidato(null)}
        >
          <article
            className="bg-primary-background rounded-2xl max-w-lg w-full max-h-screen overflow-y-auto p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                {logoMap[selectedCandidato.partido] ? (
                  <div className="w-10 h-10 relative shrink-0">
                    <Image
                      src={logoMap[selectedCandidato.partido]}
                      alt={`Logo ${selectedCandidato.partido}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full mt-1 shrink-0 bg-gray-400" />
                )}
                <div>
                  <h2 className="font-title text-subtitle text-xl font-bold">
                    {selectedCandidato.nombreCompleto}
                  </h2>
                  <p className="font-body text-subtitle/60 text-sm mt-1">
                    {selectedCandidato.partido}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidato(null)}
                className="text-2xl text-subtitle/60 hover:text-subtitle transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Info básica */}
            <div className="mt-4 bg-white/50 rounded-lg px-4 py-3 space-y-2">
              <p className="text-sm text-subtitle/60 font-body">
                Postula a:{" "}
                <span className="font-bold text-subtitle">
                  {selectedCandidato.cargo}
                </span>
              </p>
              {selectedCandidato.postulaDepartamento && (
                <p className="text-sm text-subtitle/60 font-body">
                  Departamento:{" "}
                  <span className="font-bold text-subtitle">
                    {selectedCandidato.postulaDepartamento}
                  </span>
                </p>
              )}
              {selectedCandidato.numeroCandidato && (
                <p className="text-sm text-subtitle/60 font-body">
                  Número:{" "}
                  <span className="font-bold text-subtitle">
                    {selectedCandidato.numeroCandidato}
                  </span>
                </p>
              )}
            </div>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap gap-3">
              <div
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  selectedCandidato.experienciaPolitica === 1
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <span>⚖️</span>
                <span className="text-sm font-body">
                  {selectedCandidato.experienciaPolitica === 1 ? "Con" : "Sin"}{" "}
                  experiencia política
                </span>
              </div>
              <div
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  selectedCandidato.experienciaCongreso === 1
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <span>🏛️</span>
                <span className="text-sm font-body">
                  {selectedCandidato.experienciaCongreso === 1 ? "Con" : "Sin"}{" "}
                  experiencia en Congreso
                </span>
              </div>
              {selectedCandidato.resumenAntecedente && (
                <div className="px-4 py-2 rounded-lg flex items-center gap-2 bg-red-100 text-red-800">
                  <span>⚠️</span>
                  <span className="text-sm font-body">Con antecedentes</span>
                </div>
              )}
            </div>

            {/* Resumen de hoja de vida */}
            {selectedCandidato.resumenHoja && (
              <div className="mt-6">
                <h4 className="font-body font-bold text-subtitle text-sm mb-2">
                  Hoja de Vida
                </h4>
                <p className="font-body text-subtitle/80 text-sm leading-relaxed">
                  {selectedCandidato.resumenHoja}
                </p>
              </div>
            )}

            {/* Resumen de antecedentes */}
            {selectedCandidato.resumenAntecedente && (
              <div className="mt-4">
                <h4 className="font-body font-bold text-red-700 text-sm mb-2">
                  ⚠️ Antecedentes
                </h4>
                <p className="font-body text-red-800/80 text-sm leading-relaxed bg-red-50 p-3 rounded-lg">
                  {selectedCandidato.resumenAntecedente}
                </p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="mt-6 flex justify-between items-center gap-3">
              <button
                onClick={() => handleCorroborar(selectedCandidato.nombreCompleto)}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-orange-900/40 hover:bg-orange-900/50 text-white rounded-lg font-body text-sm transition-colors"
              >
                <span>🔍</span>
                Corroborar en JNE
              </button>
              <button
                onClick={() => setSelectedCandidato(null)}
                className="btn-primary"
              >
                Cerrar
              </button>
            </div>
          </article>
        </dialog>
      )}

      {/* Footer espaciado */}
      <div className="h-16"></div>
    </main>
  );
}
