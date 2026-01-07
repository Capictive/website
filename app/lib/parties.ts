export type Party = {
    id: string;
    name: string;
    description: string;
    logo: string; // path in public/
    candidateImage: string; // path in public/
};

export type Benchmark = {
    codigo_pais: string;
    caso_similar: string;
    descripcion: string;
    leccion: string;
    nivel_similitud: string;
};

export type Eje = {
    categoria: string;
    propuesta_estrella: string;
    que_proponen: string[];
    dato_curioso: string;
    para_reflexionar: string;
    benchmark_internacional: Benchmark;
    fuente_pagina: string;
};

export type PartyDetail = {
    partido: string;
    slogan_detectado: string;
    vision_resumen: string;
    ejes: Eje[];
    lo_que_no_dicen: string;
    fuentes_consultadas: string[];
    presidente_links: string[];
    logo_links: string[];
};

const logoMap: Record<string, string> = {
  "Ahora Nación": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743028/Capictive/Logo/ahora_nacion_logo.png",
  "Alianza Electoral Venceremos": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743029/Capictive/Logo/alianza_electoral_venceremos_logo.jpg",
  "Alianza Fuerza y Libertad": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743030/Capictive/Logo/alianza_fuerza_y_libertad_logo.png",
  "Alianza Para el Progreso": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743030/Capictive/Logo/alianza_para_el_progreso_logo.png",
  "Alianza Unidad Nacional": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743031/Capictive/Logo/alianza_unidad_nacional_logo.jpg",
  "Avanza País": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743031/Capictive/Logo/avanza_pais_logo.png",
  "Cooperación Popular": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743032/Capictive/Logo/cooperacion_popular_logo.png",
  "Frente de la Esperanza": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743033/Capictive/Logo/frente_de_la_esperanza_logo.png",
  "Fuerza Popular": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743033/Capictive/Logo/fuerza_popular_logo.png",
  "Integrida Democrática": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743034/Capictive/Logo/integrida_democratica_logo.jpg",
  "Juntos por el Perú": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743035/Capictive/Logo/juntos_por_el_peru_logo.png",
  "Libertad Popular": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743035/Capictive/Logo/libertad_popular_logo.jpg",
  "Partido Aprista Peruano": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743036/Capictive/Logo/partido_aprista_peruano_logo.png",
  "Partido Cívico Obras": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743037/Capictive/Logo/partido_civico_obras_logo.png",
  "Partido de los Trabajadores y Emprendedores PTE - PERU": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743037/Capictive/Logo/partido_de_los_trabajadores_y_emprendedores_pte_-_peru_logo.jpg",
  "Partido del Buen Gobierno": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743038/Capictive/Logo/partido_del_buen_gobierno_logo.jpg",
  "Partido Democrático Federal": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743038/Capictive/Logo/partido_democratico_federal_logo.png",
  "Partido Demócrata Unido Perú": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743039/Capictive/Logo/partido_democrata_unido_peru_logo.jpg",
  "Partido Demócrata Verde": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743039/Capictive/Logo/partido_democrata_verde_logo.png",
  "Partido Morado": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743040/Capictive/Logo/partido_morado_logo.png",
  "Partido Patriótico del Perú": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743040/Capictive/Logo/partido_patriotico_del_peru_logo.png",
  "Partido Político PRIN": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743041/Capictive/Logo/partido_politico_prin_logo.png",
  "País para todos": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743041/Capictive/Logo/pais_para_todos_logo.png",
  "Perú Acción": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743042/Capictive/Logo/peru_accion_logo.png",
  "Perú Libre": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743042/Capictive/Logo/peru_libre_logo.png",
  "Perú Moderno": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743043/Capictive/Logo/peru_moderno_logo.jpg",
  "Perú Primero": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743045/Capictive/Logo/peru_primero_logo_2.png",
  "Podemos Perú": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743046/Capictive/Logo/podemos_peru_logo.png",
  "Progresemos": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743047/Capictive/Logo/progresemos_logo.jpg",
  "Renovación Popular": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743047/Capictive/Logo/renovacion_popular_logo.png",
  "Salvemos al Perú": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743048/Capictive/Logo/salvemos_al_peru_logo.png",
  "SiCreo": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743049/Capictive/Logo/sicreo_logo.png",
  "Somos Perú": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743050/Capictive/Logo/somos_peru_logo.svg",
  "Un Camino Diferente": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743052/Capictive/Logo/un_camino_diferente_logo.jpg",
};

export const PARTIES: Party[] = [
    { id: "ahora_nacion", name: "Ahora Nación", description: "Partido político peruano", logo: logoMap["Ahora Nación"], candidateImage: "/capictive.png" },
    { id: "alianza_electoral_venceremos", name: "Alianza Electoral Venceremos", description: "Partido político peruano", logo: logoMap["Alianza Electoral Venceremos"], candidateImage: "/capictive.png" },
    { id: "alianza_fuerza_libertad", name: "Alianza Fuerza y Libertad", description: "Partido político peruano", logo: logoMap["Alianza Fuerza y Libertad"], candidateImage: "/capictive.png" },
    { id: "alianza_para_el_progreso", name: "Alianza Para el Progreso", description: "Partido político peruano", logo: logoMap["Alianza Para el Progreso"], candidateImage: "/capictive.png" },
    { id: "alianza_unidad_nacional", name: "Alianza Unidad Nacional", description: "Partido político peruano", logo: logoMap["Alianza Unidad Nacional"], candidateImage: "/capictive.png" },
    { id: "avanza_pais", name: "Avanza País", description: "Partido político peruano", logo: logoMap["Avanza País"], candidateImage: "/capictive.png" },
    { id: "cooperacion_popular", name: "Cooperación Popular", description: "Partido político peruano", logo: logoMap["Cooperación Popular"], candidateImage: "/capictive.png" },
    { id: "frente_de_la_esperanza", name: "Frente de la Esperanza", description: "Partido político peruano", logo: logoMap["Frente de la Esperanza"], candidateImage: "/capictive.png" },
    { id: "fuerza_popular", name: "Fuerza Popular", description: "Partido político peruano", logo: logoMap["Fuerza Popular"], candidateImage: "/capictive.png" },
    { id: "integridad_democratica", name: "Integrida Democrática", description: "Partido político peruano", logo: logoMap["Integrida Democrática"], candidateImage: "/capictive.png" },
    { id: "juntos_por_el_peru", name: "Juntos por el Perú", description: "Partido político peruano", logo: logoMap["Juntos por el Perú"], candidateImage: "/capictive.png" },
    { id: "libertad_popular", name: "Libertad Popular", description: "Partido político peruano", logo: logoMap["Libertad Popular"], candidateImage: "/capictive.png" },
    { id: "partido_aprista_peruano", name: "Partido Aprista Peruano", description: "Partido político peruano", logo: logoMap["Partido Aprista Peruano"], candidateImage: "/capictive.png" },
    { id: "partido_civico_obras", name: "Partido Cívico Obras", description: "Partido político peruano", logo: logoMap["Partido Cívico Obras"], candidateImage: "/capictive.png" },
    { id: "partido_trabajadores_emprendedores_pte_peru", name: "Partido de los Trabajadores y Emprendedores PTE - PERU", description: "Partido político peruano", logo: logoMap["Partido de los Trabajadores y Emprendedores PTE - PERU"], candidateImage: "/capictive.png" },
    { id: "partido_del_buen_gobierno", name: "Partido del Buen Gobierno", description: "Partido político peruano", logo: logoMap["Partido del Buen Gobierno"], candidateImage: "/capictive.png" },
    { id: "partido_democratico_federal", name: "Partido Democrático Federal", description: "Partido político peruano", logo: logoMap["Partido Democrático Federal"], candidateImage: "/capictive.png" },
    { id: "partido_democrata_unido_peru", name: "Partido Demócrata Unido Perú", description: "Partido político peruano", logo: logoMap["Partido Demócrata Unido Perú"], candidateImage: "/capictive.png" },
    { id: "partido_democrata_verde", name: "Partido Demócrata Verde", description: "Partido político peruano", logo: logoMap["Partido Demócrata Verde"], candidateImage: "/capictive.png" },
    { id: "partido_morado", name: "Partido Morado", description: "Partido político peruano", logo: logoMap["Partido Morado"], candidateImage: "/capictive.png" },
    { id: "partido_patriotico_del_peru", name: "Partido Patriótico del Perú", description: "Partido político peruano", logo: logoMap["Partido Patriótico del Perú"], candidateImage: "/capictive.png" },
    { id: "partido_politico_prin", name: "Partido Político PRIN", description: "Partido político peruano", logo: logoMap["Partido Político PRIN"], candidateImage: "/capictive.png" },
    { id: "pais_para_todos", name: "País para todos", description: "Partido político peruano", logo: logoMap["País para todos"], candidateImage: "/capictive.png" },
    { id: "peru_accion", name: "Perú Acción", description: "Partido político peruano", logo: logoMap["Perú Acción"], candidateImage: "/capictive.png" },
    { id: "peru_libre", name: "Perú Libre", description: "Partido político peruano", logo: logoMap["Perú Libre"], candidateImage: "/capictive.png" },
    { id: "peru_moderno", name: "Perú Moderno", description: "Partido político peruano", logo: logoMap["Perú Moderno"], candidateImage: "/capictive.png" },
    { id: "peru_primero", name: "Perú Primero", description: "Partido político peruano", logo: logoMap["Perú Primero"], candidateImage: "/capictive.png" },
    { id: "podemos_peru", name: "Podemos Perú", description: "Partido político peruano", logo: logoMap["Podemos Perú"], candidateImage: "/capictive.png" },
    { id: "progresemos", name: "Progresemos", description: "Partido político peruano", logo: logoMap["Progresemos"], candidateImage: "/capictive.png" },
    { id: "renovacion_popular", name: "Renovación Popular", description: "Partido político peruano", logo: logoMap["Renovación Popular"], candidateImage: "/capictive.png" },
    { id: "salvemos_al_peru", name: "Salvemos al Perú", description: "Partido político peruano", logo: logoMap["Salvemos al Perú"], candidateImage: "/capictive.png" },
    { id: "sicreo", name: "SiCreo", description: "Partido político peruano", logo: logoMap["SiCreo"], candidateImage: "/capictive.png" },
    { id: "somos_peru", name: "Somos Perú", description: "Partido político peruano", logo: logoMap["Somos Perú"], candidateImage: "/capictive.png" },
    { id: "un_camino_diferente", name: "Un Camino Diferente", description: "Partido político peruano", logo: logoMap["Un Camino Diferente"], candidateImage: "/capictive.png" },
];
