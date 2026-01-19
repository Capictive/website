export type Candidatos = {
    presidente: string;
    primer_vicepresidente: string;
    segundo_vicepresidente: string;
};

export type Party = {
    id: string;
    name: string;
    description: string;
    logo: string; // path in public/
    candidateImage: string; // path in public/
    candidatos: Candidatos;
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

export type Problema = {
    titulo: string;
    resumen: string;
    ejemplo: string;
    solución: string;
    "resolución de ejemplo": string;
};

export type Escandalo = {
    titulo: string;
    información: string;
    involucrados: string[];
    fuentes: string[];
};

export type PartyDetail = {
    partido: string;
    slogan_detectado: string;
    vision_resumen: string;
    ejes: Eje[];
    problemas?: Problema[];
    lo_que_no_dicen: string;
    fuentes_consultadas: string[];
    presidente_links: string[];
    logo_links: string[];
};

const logoMap: Record<string, string> = {
    "Ahora Nación": "/political parties/ahora_nacion_logo.png",
    "Alianza Electoral Venceremos":
        "/political parties/alianza_electoral_venceremos_logo.jpg",
    "Alianza Fuerza y Libertad":
        "/political parties/alianza_fuerza_y_libertad_logo.png",
    "Alianza Para el Progreso":
        "/political parties/alianza_para_el_progreso_logo.png",
    "Alianza Unidad Nacional":
        "/political parties/alianza_unidad_nacional_logo.jpg",
    "Avanza País": "/political parties/avanza_pais_logo.png",
    "Cooperación Popular": "/political parties/cooperacion_popular_logo.png",
    "Fe en el Perú": "/political parties/fe_en_el_peru_logo.png",
    "Frente de la Esperanza":
        "/political parties/frente_de_la_esperanza_logo.png",
    "Fuerza Popular": "/political parties/fuerza_popular_logo.png",
    "Integridad Democrática": "/political parties/integrida_democratica_logo.jpg",
    "Juntos por el Perú": "/political parties/juntos_por_el_peru_logo.png",
    "Libertad Popular": "/political parties/libertad_popular_logo.jpg",
    "Partido Aprista Peruano":
        "/political parties/partido_aprista_peruano_logo.png",
    "Partido Cívico Obras": "/political parties/partido_civico_obras_logo.png",
    "Partido de los Trabajadores y Emprendedores PTE - PERU":
        "/political parties/partido_de_los_trabajadores_y_emprendedores_pte_-_peru_logo.jpg",
    "Partido del Buen Gobierno":
        "/political parties/partido_del_buen_gobierno_logo.jpg",
    "Partido Democrático Federal":
        "/political parties/partido_democratico_federal_logo.png",
    "Partido Demócrata Unido Perú":
        "/political parties/partido_democrata_unido_peru_logo.jpg",
    "Partido Demócrata Verde":
        "/political parties/partido_democrata_verde_logo.png",
    "Partido Morado": "/political parties/partido_morado_logo.png",
    "Partido Patriótico del Perú":
        "/political parties/partido_patriotico_del_peru_logo.png",
    "Partido Político PRIN": "/political parties/partido_politico_prin_logo.png",
    "País para todos": "/political parties/pais_para_todos_logo.png",
    "Perú Acción": "/political parties/peru_accion_logo.png",
    "Perú Libre": "/political parties/peru_libre_logo.png",
    "Perú Moderno": "/political parties/peru_moderno_logo.jpg",
    "Perú Primero": "/political parties/peru_primero_logo.png",
    "Podemos Perú": "/political parties/podemos_peru_logo.png",
    Progresemos: "/political parties/progresemos_logo.jpg",
    "Renovación Popular": "/political parties/renovacion_popular_logo.png",
    "Salvemos al Perú": "/political parties/salvemos_al_peru_logo.png",
    SiCreo: "/political parties/sicreo_logo.png",
    "Somos Perú": "/political parties/somos_peru_logo.svg",
    "Un Camino Diferente": "/political parties/un_camino_diferente_logo.jpg",
};

const candidatosMap: Record<string, Candidatos> = {
    "Ahora Nación": {
        presidente: "Alfonso López-Chau Nava",
        primer_vicepresidente: "Luis Villanueva Carbajal",
        segundo_vicepresidente: "Ruth Buendía Mestoquiari",
    },
    "Alianza Electoral Venceremos": {
        presidente: "Ronald Atencio Sotomayor",
        primer_vicepresidente: "Elena Rivera",
        segundo_vicepresidente: "Alberto Quintanilla Chacón",
    },
    "Alianza Fuerza y Libertad": {
        presidente: "Fiorella Giannina Molinelli Aristondo",
        primer_vicepresidente: "Gilbert Félix Violeta López",
        segundo_vicepresidente: "María Pariona",
    },
    "Alianza Para el Progreso": {
        presidente: "César Acuña Peralta",
        primer_vicepresidente: "Jessica Tumi Rivas",
        segundo_vicepresidente: "Alejandro Soto Reyes",
    },
    "Alianza Unidad Nacional": {
        presidente: "Roberto Enrique Chiabra León",
        primer_vicepresidente: "Javier Bedoya Denegri",
        segundo_vicepresidente: "Neldy Roxana Mendoza Flores",
    },
    "Avanza País": {
        presidente: "José Daniel Williams Zapata",
        primer_vicepresidente: "Fernán Altuve-Febres Lores",
        segundo_vicepresidente: "Adriana Josefina Tudela Gutiérrez",
    },
    "Cooperación Popular": {
        presidente: "Yonhy Lescano Ancieta",
        primer_vicepresidente: "Carmela Salazar",
        segundo_vicepresidente: "Vanessa Lazo",
    },
    "Fe en el Perú": {
        presidente: "Alvaro Gonzalo Paz de la Barra",
        primer_vicepresidente: "Yessika Roxsana Arteaga Narvaez",
        segundo_vicepresidente: "Shellah Belen Palacios Rodriguez",
    },
    "Frente de la Esperanza": {
        presidente: "Fernando Olivera Vega",
        primer_vicepresidente: "Elizabeth León Chinchay",
        segundo_vicepresidente: "Carlos Cuaresma Sánchez",
    },
    "Fuerza Popular": {
        presidente: "Keiko Sofía Fujimori Higuchi",
        primer_vicepresidente: "Luis Fernando Galarreta Velarde",
        segundo_vicepresidente: "Miguel Ángel Torres Morales",
    },
    "Integridad Democrática": {
        presidente: "Wolfgang Grozo Costa",
        primer_vicepresidente: "Betha Azabache Miranda",
        segundo_vicepresidente: "Wellington Prada",
    },
    "Juntos por el Perú": {
        presidente: "Roberto Helbert Sánchez Palomino",
        primer_vicepresidente: "Anali Márquez",
        segundo_vicepresidente: "Brígida Curo Bustincio",
    },
    "Libertad Popular": {
        presidente: "Rafael Belaunde Llosa",
        primer_vicepresidente: "Pedro Álvaro Cateriano Bellido",
        segundo_vicepresidente: "Tania Porles Bazalar",
    },
    "Partido Aprista Peruano": {
        presidente: "Enrique Valderrama Peña ",
        primer_vicepresidente: "María Inés Valdivia",
        segundo_vicepresidente: "Lucio Vásquez Sánchez",
    },
    "Partido Cívico Obras": {
        presidente: "Ricardo Pablo Belmont Cassinelli",
        primer_vicepresidente: "Daniel Barragán Coloma",
        segundo_vicepresidente: "Dina Hancco",
    },
    "Partido de los Trabajadores y Emprendedores PTE - PERU": {
        presidente: "Napoleón Becerra",
        primer_vicepresidente: "Winston Clemente Huamán",
        segundo_vicepresidente: "Nélida Cuayla",
    },
    "Partido del Buen Gobierno": {
        presidente: "Jorge Nieto Montesinos",
        primer_vicepresidente: "Susana Matute",
        segundo_vicepresidente: "Carlos Caballero León",
    },
    "Partido Democrático Federal": {
        presidente: "Armando Massé Fernández",
        primer_vicepresidente: "Virgilio Acuña Peralta",
        segundo_vicepresidente: "Lydia Díaz",
    },
    "Partido Demócrata Unido Perú": {
        presidente: "Charlie Carrasco",
        primer_vicepresidente: "María Paredes",
        segundo_vicepresidente: "Wilbert Segovia",
    },
    "Partido Demócrata Verde": {
        presidente: "Alex Castillo Gonzales",
        primer_vicepresidente: "Maritza Sánchez Perales",
        segundo_vicepresidente: "Félix Murazzo Carrillo",
    },
    "Partido Morado": {
        presidente: "Mesías Antonio Guevara Amasifuén",
        primer_vicepresidente: "Heber Cueva",
        segundo_vicepresidente: "Marisol Liñan",
    },
    "Partido Patriótico del Perú": {
        presidente: "Herbert Caller Gutiérrez",
        primer_vicepresidente: "Rossana Montes Tello",
        segundo_vicepresidente: "Jorge Carcovich",
    },
    "Partido Político PRIN": {
        presidente: "Walter Chirinos Purizaga",
        primer_vicepresidente: "Julio Vega Ybañez",
        segundo_vicepresidente: "Mayra Vargas Gil",
    },
    "País para todos": {
        presidente: "Carlos Alberto Álvarez Loayza",
        primer_vicepresidente: "María Chambizea",
        segundo_vicepresidente: "Diego Guevara",
    },
    "Perú Acción": {
        presidente: "Francisco Diez Canseco Távara",
        primer_vicepresidente: "Roberto Koster",
        segundo_vicepresidente: "Clara Quispe Torres",
    },
    "Perú Libre": {
        presidente: "Vladimir Roy Cerrón Rojas",
        primer_vicepresidente: "Flavio Cruz Mamani",
        segundo_vicepresidente: "Bertha Rojas López",
    },
    "Perú Moderno": {
        presidente: "Carlos Jaico Carranza",
        primer_vicepresidente: "Miguel Almenara",
        segundo_vicepresidente: "Liz Quispe",
    },
    "Perú Primero": {
        presidente: "Mario Vizcarra Cornejo",
        primer_vicepresidente: "Carlos Illanes",
        segundo_vicepresidente: "Judith Mendoza",
    },
    "Podemos Perú": {
        presidente: "José León Luna Gálvez",
        primer_vicepresidente: "Cecilia Jaqueline García Rodríguez",
        segundo_vicepresidente: "Raúl Noblecilla Olaechea",
    },
    Progresemos: {
        presidente: "Paul Jaimes Blanco",
        primer_vicepresidente: "Mónica Guillén",
        segundo_vicepresidente: "Jorge Luis Caloggero",
    },
    "Renovación Popular": {
        presidente: "Rafael Bernardo López Aliaga Cazorla",
        primer_vicepresidente: "Norma Yarrow Lumbreras",
        segundo_vicepresidente: "Jhon Ramos Malpica",
    },
    "Salvemos al Perú": {
        presidente: "Antonio Ortiz Villano",
        primer_vicepresidente: "Jaime José Freundt López",
        segundo_vicepresidente: "Giovanna Demurtas Moya",
    },
    SiCreo: {
        presidente: "Carlos Espá Garcés-Alvear",
        primer_vicepresidente: "Alejandro Santa María Silva",
        segundo_vicepresidente: "Melitza Yanzich",
    },
    "Somos Perú": {
        presidente: "George Patrick Forsyth Sommer",
        primer_vicepresidente: "Johanna Lozada",
        segundo_vicepresidente: "Herbe Olave",
    },
    "Un Camino Diferente": {
        presidente: "Rosario Fernández Bazán",
        primer_vicepresidente: "Arturo Fernández Bazán",
        segundo_vicepresidente: "Carlos Pinillos Vinces",
    },
};

const defaultCandidatos: Candidatos = {
    presidente: "Por definir",
    primer_vicepresidente: "Por definir",
    segundo_vicepresidente: "Por definir",
};

const portraitMap: Record<string, string> = {
    ahora_nacion: "/portraits/ahora_nacion_portrait.jpg",
    alianza_electoral_venceremos:
        "/portraits/alianza_electoral_venceremos_portrait.jpg",
    alianza_fuerza_libertad: "/portraits/alianza_fuerza_y_libertad_portrait.jpg",
    alianza_para_el_progreso: "/portraits/alianza_para_el_progreso_portrait.jpg",
    alianza_unidad_nacional: "/portraits/alianza_unidad_nacional_portrait.jpg",
    avanza_pais: "/portraits/avanza_pais_portrait.jpg",
    cooperacion_popular: "/portraits/cooperacion_popular_portrait.jpg",
    frente_de_la_esperanza: "/portraits/frente_de_la_esperanza_portrait.jpg",
    fuerza_popular: "/portraits/fuerza_popular_portrait.jpg",
    fe_en_el_peru: "/portraits/fe_en_el_peru_portrait.jpg",
    integridad_democratica: "/portraits/integrida_democratica_portrait.jpg",
    juntos_por_el_peru: "/portraits/juntos_por_el_peru_portrait.jpg",
    libertad_popular: "/portraits/libertad_popular_portrait.jpg",
    partido_aprista_peruano: "/portraits/partido_aprista_peruano_portrait.jpg",
    partido_civico_obras: "/portraits/partido_civico_obras_portrait.jpg",
    partido_trabajadores_emprendedores_pte_peru:
        "/portraits/partido_de_los_trabajadores_y_emprendedores_pte_-_peru_portrait.jpg",
    partido_del_buen_gobierno:
        "/portraits/partido_del_buen_gobierno_portrait.jpg",
    partido_democratico_federal:
        "/portraits/partido_democratico_federal_portrait.jpg",
    partido_democrata_unido_peru:
        "/portraits/partido_democrata_unido_peru_portrait.jpg",
    partido_democrata_verde: "/portraits/partido_democrata_verde_portrait.jpg",
    partido_morado: "/portraits/partido_morado_portrait.jpg",
    partido_patriotico_del_peru:
        "/portraits/partido_patriotico_del_peru_portrait.jpg",
    partido_politico_prin: "/portraits/partido_politico_prin_portrait.jpg",
    pais_para_todos: "/portraits/pais_para_todos_portrait.jpg",
    peru_accion: "/portraits/peru_accion_portrait.jpg",
    peru_libre: "/portraits/peru_libre_portrait.jpg",
    peru_moderno: "/portraits/peru_moderno_portrait.jpg",
    peru_primero: "/portraits/peru_primero_portrait.jpg",
    podemos_peru: "/portraits/podemos_peru_portrait.jpg",
    progresemos: "/portraits/progresemos_portrait.jpg",
    renovacion_popular: "/portraits/renovacion_popular_portrait.jpg",
    salvemos_al_peru: "/portraits/salvemos_al_peru_portrait.jpg",
    sicreo: "/portraits/sicreo_portrait.jpg",
    somos_peru: "/portraits/somos_peru_portrait.jpg",
    un_camino_diferente: "/portraits/un_camino_diferente_portrait.jpg",
};

export function getPortraitById(id: string) {
    return portraitMap[id] || "/capictive.png";
}

export const PARTIES: Party[] = [
    {
        id: "ahora_nacion",
        name: "Ahora Nación",
        description: "Partido político peruano",
        logo: logoMap["Ahora Nación"],
        candidateImage: getPortraitById("ahora_nacion"),
        candidatos: candidatosMap["Ahora Nación"] || defaultCandidatos,
    },
    {
        id: "alianza_electoral_venceremos",
        name: "Alianza Electoral Venceremos",
        description: "Partido político peruano",
        logo: logoMap["Alianza Electoral Venceremos"],
        candidateImage: getPortraitById("alianza_electoral_venceremos"),
        candidatos:
            candidatosMap["Alianza Electoral Venceremos"] || defaultCandidatos,
    },
    {
        id: "alianza_fuerza_libertad",
        name: "Alianza Fuerza y Libertad",
        description: "Partido político peruano",
        logo: logoMap["Alianza Fuerza y Libertad"],
        candidateImage: getPortraitById("alianza_fuerza_libertad"),
        candidatos: candidatosMap["Alianza Fuerza y Libertad"] || defaultCandidatos,
    },
    {
        id: "alianza_para_el_progreso",
        name: "Alianza Para el Progreso",
        description: "Partido político peruano",
        logo: logoMap["Alianza Para el Progreso"],
        candidateImage: getPortraitById("alianza_para_el_progreso"),
        candidatos: candidatosMap["Alianza Para el Progreso"] || defaultCandidatos,
    },
    {
        id: "alianza_unidad_nacional",
        name: "Alianza Unidad Nacional",
        description: "Partido político peruano",
        logo: logoMap["Alianza Unidad Nacional"],
        candidateImage: getPortraitById("alianza_unidad_nacional"),
        candidatos: candidatosMap["Alianza Unidad Nacional"] || defaultCandidatos,
    },
    {
        id: "avanza_pais",
        name: "Avanza País",
        description: "Partido político peruano",
        logo: logoMap["Avanza País"],
        candidateImage: getPortraitById("avanza_pais"),
        candidatos: candidatosMap["Avanza País"] || defaultCandidatos,
    },
    {
        id: "cooperacion_popular",
        name: "Cooperación Popular",
        description: "Partido político peruano",
        logo: logoMap["Cooperación Popular"],
        candidateImage: getPortraitById("cooperacion_popular"),
        candidatos: candidatosMap["Cooperación Popular"] || defaultCandidatos,
    },
    {
        id: "frente_de_la_esperanza",
        name: "Frente de la Esperanza",
        description: "Partido político peruano",
        logo: logoMap["Frente de la Esperanza"],
        candidateImage: getPortraitById("frente_de_la_esperanza"),
        candidatos: candidatosMap["Frente de la Esperanza"] || defaultCandidatos,
    },
    {
        id: "fuerza_popular",
        name: "Fuerza Popular",
        description: "Partido político peruano",
        logo: logoMap["Fuerza Popular"],
        candidateImage: getPortraitById("fuerza_popular"),
        candidatos: candidatosMap["Fuerza Popular"] || defaultCandidatos,
    },
    {
        id: "fe_en_el_peru",
        name: "Fe en el Perú",
        description: "Partido político peruano",
        logo: logoMap["Fe en el Perú"],
        candidateImage: getPortraitById("fe_en_el_peru"),
        candidatos: candidatosMap["Fe en el Perú"] || defaultCandidatos,
    },
    {
        id: "integridad_democratica",
        name: "Integridad Democrática",
        description: "Partido político peruano",
        logo: logoMap["Integridad Democrática"],
        candidateImage: getPortraitById("integridad_democratica"),
        candidatos: candidatosMap["Integridad Democrática"] || defaultCandidatos,
    },
    {
        id: "juntos_por_el_peru",
        name: "Juntos por el Perú",
        description: "Partido político peruano",
        logo: logoMap["Juntos por el Perú"],
        candidateImage: getPortraitById("juntos_por_el_peru"),
        candidatos: candidatosMap["Juntos por el Perú"] || defaultCandidatos,
    },
    {
        id: "libertad_popular",
        name: "Libertad Popular",
        description: "Partido político peruano",
        logo: logoMap["Libertad Popular"],
        candidateImage: getPortraitById("libertad_popular"),
        candidatos: candidatosMap["Libertad Popular"] || defaultCandidatos,
    },
    {
        id: "partido_aprista_peruano",
        name: "Partido Aprista Peruano",
        description: "Partido político peruano",
        logo: logoMap["Partido Aprista Peruano"],
        candidateImage: getPortraitById("partido_aprista_peruano"),
        candidatos: candidatosMap["Partido Aprista Peruano"] || defaultCandidatos,
    },
    {
        id: "partido_civico_obras",
        name: "Partido Cívico Obras",
        description: "Partido político peruano",
        logo: logoMap["Partido Cívico Obras"],
        candidateImage: getPortraitById("partido_civico_obras"),
        candidatos: candidatosMap["Partido Cívico Obras"] || defaultCandidatos,
    },
    {
        id: "partido_trabajadores_emprendedores_pte_peru",
        name: "Partido de los Trabajadores y Emprendedores PTE - PERU",
        description: "Partido político peruano",
        logo: logoMap["Partido de los Trabajadores y Emprendedores PTE - PERU"],
        candidateImage: getPortraitById(
            "partido_trabajadores_emprendedores_pte_peru",
        ),
        candidatos:
            candidatosMap["Partido de los Trabajadores y Emprendedores PTE - PERU"] ||
            defaultCandidatos,
    },
    {
        id: "partido_del_buen_gobierno",
        name: "Partido del Buen Gobierno",
        description: "Partido político peruano",
        logo: logoMap["Partido del Buen Gobierno"],
        candidateImage: getPortraitById("partido_del_buen_gobierno"),
        candidatos: candidatosMap["Partido del Buen Gobierno"] || defaultCandidatos,
    },
    {
        id: "partido_democratico_federal",
        name: "Partido Democrático Federal",
        description: "Partido político peruano",
        logo: logoMap["Partido Democrático Federal"],
        candidateImage: getPortraitById("partido_democratico_federal"),
        candidatos:
            candidatosMap["Partido Democrático Federal"] || defaultCandidatos,
    },
    {
        id: "partido_democrata_unido_peru",
        name: "Partido Demócrata Unido Perú",
        description: "Partido político peruano",
        logo: logoMap["Partido Demócrata Unido Perú"],
        candidateImage: getPortraitById("partido_democrata_unido_peru"),
        candidatos:
            candidatosMap["Partido Demócrata Unido Perú"] || defaultCandidatos,
    },
    {
        id: "partido_democrata_verde",
        name: "Partido Demócrata Verde",
        description: "Partido político peruano",
        logo: logoMap["Partido Demócrata Verde"],
        candidateImage: getPortraitById("partido_democrata_verde"),
        candidatos: candidatosMap["Partido Demócrata Verde"] || defaultCandidatos,
    },
    {
        id: "partido_morado",
        name: "Partido Morado",
        description: "Partido político peruano",
        logo: logoMap["Partido Morado"],
        candidateImage: getPortraitById("partido_morado"),
        candidatos: candidatosMap["Partido Morado"] || defaultCandidatos,
    },
    {
        id: "partido_patriotico_del_peru",
        name: "Partido Patriótico del Perú",
        description: "Partido político peruano",
        logo: logoMap["Partido Patriótico del Perú"],
        candidateImage: getPortraitById("partido_patriotico_del_peru"),
        candidatos:
            candidatosMap["Partido Patriótico del Perú"] || defaultCandidatos,
    },
    {
        id: "partido_politico_prin",
        name: "Partido Político PRIN",
        description: "Partido político peruano",
        logo: logoMap["Partido Político PRIN"],
        candidateImage: getPortraitById("partido_politico_prin"),
        candidatos: candidatosMap["Partido Político PRIN"] || defaultCandidatos,
    },
    {
        id: "pais_para_todos",
        name: "País para todos",
        description: "Partido político peruano",
        logo: logoMap["País para todos"],
        candidateImage: getPortraitById("pais_para_todos"),
        candidatos: candidatosMap["País para todos"] || defaultCandidatos,
    },
    {
        id: "peru_accion",
        name: "Perú Acción",
        description: "Partido político peruano",
        logo: logoMap["Perú Acción"],
        candidateImage: getPortraitById("peru_accion"),
        candidatos: candidatosMap["Perú Acción"] || defaultCandidatos,
    },
    {
        id: "peru_libre",
        name: "Perú Libre",
        description: "Partido político peruano",
        logo: logoMap["Perú Libre"],
        candidateImage: getPortraitById("peru_libre"),
        candidatos: candidatosMap["Perú Libre"] || defaultCandidatos,
    },
    {
        id: "peru_moderno",
        name: "Perú Moderno",
        description: "Partido político peruano",
        logo: logoMap["Perú Moderno"],
        candidateImage: getPortraitById("peru_moderno"),
        candidatos: candidatosMap["Perú Moderno"] || defaultCandidatos,
    },
    {
        id: "peru_primero",
        name: "Perú Primero",
        description: "Partido político peruano",
        logo: logoMap["Perú Primero"],
        candidateImage: getPortraitById("peru_primero"),
        candidatos: candidatosMap["Perú Primero"] || defaultCandidatos,
    },
    {
        id: "podemos_peru",
        name: "Podemos Perú",
        description: "Partido político peruano",
        logo: logoMap["Podemos Perú"],
        candidateImage: getPortraitById("podemos_peru"),
        candidatos: candidatosMap["Podemos Perú"] || defaultCandidatos,
    },
    {
        id: "progresemos",
        name: "Progresemos",
        description: "Partido político peruano",
        logo: logoMap["Progresemos"],
        candidateImage: getPortraitById("progresemos"),
        candidatos: candidatosMap["Progresemos"] || defaultCandidatos,
    },
    {
        id: "renovacion_popular",
        name: "Renovación Popular",
        description: "Partido político peruano",
        logo: logoMap["Renovación Popular"],
        candidateImage: getPortraitById("renovacion_popular"),
        candidatos: candidatosMap["Renovación Popular"] || defaultCandidatos,
    },
    {
        id: "salvemos_al_peru",
        name: "Salvemos al Perú",
        description: "Partido político peruano",
        logo: logoMap["Salvemos al Perú"],
        candidateImage: getPortraitById("salvemos_al_peru"),
        candidatos: candidatosMap["Salvemos al Perú"] || defaultCandidatos,
    },
    {
        id: "sicreo",
        name: "SiCreo",
        description: "Partido político peruano",
        logo: logoMap["SiCreo"],
        candidateImage: getPortraitById("sicreo"),
        candidatos: candidatosMap["SiCreo"] || defaultCandidatos,
    },
    {
        id: "somos_peru",
        name: "Somos Perú",
        description: "Partido político peruano",
        logo: logoMap["Somos Perú"],
        candidateImage: getPortraitById("somos_peru"),
        candidatos: candidatosMap["Somos Perú"] || defaultCandidatos,
    },
    {
        id: "un_camino_diferente",
        name: "Un Camino Diferente",
        description: "Partido político peruano",
        logo: logoMap["Un Camino Diferente"],
        candidateImage: getPortraitById("un_camino_diferente"),
        candidatos: candidatosMap["Un Camino Diferente"] || defaultCandidatos,
    },
];
