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
    "Ahora Nación": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743028/Capictive/Logo/ahora_nacion_logo.png",
    "Alianza Electoral Venceremos": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743029/Capictive/Logo/alianza_electoral_venceremos_logo.jpg",
    "Alianza Fuerza y Libertad": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743030/Capictive/Logo/alianza_fuerza_y_libertad_logo.png",
    "Alianza Para el Progreso": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743030/Capictive/Logo/alianza_para_el_progreso_logo.png",
    "Alianza Unidad Nacional": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743031/Capictive/Logo/alianza_unidad_nacional_logo.jpg",
    "Avanza País": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743031/Capictive/Logo/avanza_pais_logo.png",
    "Cooperación Popular": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743032/Capictive/Logo/cooperacion_popular_logo.png",
    "Fe en el Perú": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767848643/LOGO_igjyeh.png",
    "Frente de la Esperanza": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743033/Capictive/Logo/frente_de_la_esperanza_logo.png",
    "Fuerza Popular": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743033/Capictive/Logo/fuerza_popular_logo.png",
    "Integridad Democrática": "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743034/Capictive/Logo/integrida_democratica_logo.jpg",
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

const candidatosMap: Record<string, Candidatos> = {
    "Ahora Nación": { presidente: "Alfonso López-Chau Nava", primer_vicepresidente: "Luis Villanueva Carbajal", segundo_vicepresidente: "Ruth Buendía Mestoquiari" },
    "Alianza Electoral Venceremos": { presidente: "Ronald Atencio Sotomayor", primer_vicepresidente: "Elena Rivera", segundo_vicepresidente: "Alberto Quintanilla Chacón" },
    "Alianza Fuerza y Libertad": { presidente: "Fiorella Giannina Molinelli Aristondo", primer_vicepresidente: "Gilbert Félix Violeta López", segundo_vicepresidente: "María Pariona" },
    "Alianza Para el Progreso": { presidente: "César Acuña Peralta", primer_vicepresidente: "Jessica Tumi Rivas", segundo_vicepresidente: "Alejandro Soto Reyes" },
    "Alianza Unidad Nacional": { presidente: "Roberto Enrique Chiabra León", primer_vicepresidente: "Javier Bedoya Denegri", segundo_vicepresidente: "Neldy Roxana Mendoza Flores" },
    "Avanza País": { presidente: "José Daniel Williams Zapata", primer_vicepresidente: "Fernán Altuve-Febres Lores", segundo_vicepresidente: "Adriana Josefina Tudela Gutiérrez" },
    "Cooperación Popular": { presidente: "Yonhy Lescano Ancieta", primer_vicepresidente: "Carmela Salazar", segundo_vicepresidente: "Vanessa Lazo" },
    "Fe en el Perú": { presidente: "Alvaro Gonzalo Paz de la Barra", primer_vicepresidente: "Yessika Roxsana Arteaga Narvaez", segundo_vicepresidente: "Shellah Belen Palacios Rodriguez" },
    "Frente de la Esperanza": { presidente: "Fernando Olivera Vega", primer_vicepresidente: "Elizabeth León Chinchay", segundo_vicepresidente: "Carlos Cuaresma Sánchez" },
    "Fuerza Popular": { presidente: "Keiko Sofía Fujimori Higuchi", primer_vicepresidente: "Luis Fernando Galarreta Velarde", segundo_vicepresidente: "Miguel Ángel Torres Morales" },
    "Integridad Democrática": { presidente: "Wolfgang Grozo Costa", primer_vicepresidente: "Betha Azabache Miranda", segundo_vicepresidente: "Wellington Prada" },
    "Juntos por el Perú": { presidente: "Roberto Helbert Sánchez Palomino", primer_vicepresidente: "Anali Márquez", segundo_vicepresidente: "Brígida Curo Bustincio" },
    "Libertad Popular": { presidente: "Rafael Belaunde Llosa", primer_vicepresidente: "Pedro Álvaro Cateriano Bellido", segundo_vicepresidente: "Tania Porles Bazalar" },
    "Partido Aprista Peruano": { presidente: "Enrique Valderrama Yuseff", primer_vicepresidente: "María Inés Valdivia", segundo_vicepresidente: "Lucio Vásquez Sánchez" },
    "Partido Cívico Obras": { presidente: "Ricardo Pablo Belmont Cassinelli", primer_vicepresidente: "Daniel Barragán Coloma", segundo_vicepresidente: "Dina Hancco" },
    "Partido de los Trabajadores y Emprendedores PTE - PERU": { presidente: "Napoleón Becerra", primer_vicepresidente: "Winston Clemente Huamán", segundo_vicepresidente: "Nélida Cuayla" },
    "Partido del Buen Gobierno": { presidente: "Jorge Nieto Montesinos", primer_vicepresidente: "Susana Matute", segundo_vicepresidente: "Carlos Caballero León" },
    "Partido Democrático Federal": { presidente: "Armando Massé Fernández", primer_vicepresidente: "Virgilio Acuña Peralta", segundo_vicepresidente: "Lydia Díaz" },
    "Partido Demócrata Unido Perú": { presidente: "Charlie Carrasco", primer_vicepresidente: "María Paredes", segundo_vicepresidente: "Wilbert Segovia" },
    "Partido Demócrata Verde": { presidente: "Alex Castillo Gonzales", primer_vicepresidente: "Maritza Sánchez Perales", segundo_vicepresidente: "Félix Murazzo Carrillo" },
    "Partido Morado": { presidente: "Mesías Antonio Guevara Amasifuén", primer_vicepresidente: "Heber Cueva", segundo_vicepresidente: "Marisol Liñan" },
    "Partido Patriótico del Perú": { presidente: "Herbert Caller Gutiérrez", primer_vicepresidente: "Rossana Montes Tello", segundo_vicepresidente: "Jorge Carcovich" },
    "Partido Político PRIN": { presidente: "Walter Chirinos Purizaga", primer_vicepresidente: "Julio Vega Ybañez", segundo_vicepresidente: "Mayra Vargas Gil" },
    "País para todos": { presidente: "Carlos Alberto Álvarez Loayza", primer_vicepresidente: "María Chambizea", segundo_vicepresidente: "Diego Guevara" },
    "Perú Acción": { presidente: "Francisco Diez Canseco Távara", primer_vicepresidente: "Roberto Koster", segundo_vicepresidente: "Clara Quispe Torres" },
    "Perú Libre": { presidente: "Vladimir Roy Cerrón Rojas", primer_vicepresidente: "Flavio Cruz Mamani", segundo_vicepresidente: "Bertha Rojas López" },
    "Perú Moderno": { presidente: "Carlos Jaico Carranza", primer_vicepresidente: "Miguel Almenara", segundo_vicepresidente: "Liz Quispe" },
    "Perú Primero": { presidente: "Mario Vizcarra Cornejo", primer_vicepresidente: "Carlos Illanes", segundo_vicepresidente: "Judith Mendoza" },
    "Podemos Perú": { presidente: "José León Luna Gálvez", primer_vicepresidente: "Cecilia Jaqueline García Rodríguez", segundo_vicepresidente: "Raúl Noblecilla Olaechea" },
    "Progresemos": { presidente: "Paul Jaimes Blanco", primer_vicepresidente: "Mónica Guillén", segundo_vicepresidente: "Jorge Luis Caloggero" },
    "Renovación Popular": { presidente: "Rafael Bernardo López Aliaga Cazorla", primer_vicepresidente: "Norma Yarrow Lumbreras", segundo_vicepresidente: "Jhon Ramos Malpica" },
    "Salvemos al Perú": { presidente: "Antonio Ortiz Villano", primer_vicepresidente: "Jaime José Freundt López", segundo_vicepresidente: "Giovanna Demurtas Moya" },
    "SiCreo": { presidente: "Carlos Espá Garcés-Alvear", primer_vicepresidente: "Alejandro Santa María Silva", segundo_vicepresidente: "Melitza Yanzich" },
    "Somos Perú": { presidente: "George Patrick Forsyth Sommer", primer_vicepresidente: "Johanna Lozada", segundo_vicepresidente: "Herbe Olave" },
    "Un Camino Diferente": { presidente: "Rosario Fernández Bazán", primer_vicepresidente: "Arturo Fernández Bazán", segundo_vicepresidente: "Carlos Pinillos Vinces" },
};

const defaultCandidatos: Candidatos = { presidente: "Por definir", primer_vicepresidente: "Por definir", segundo_vicepresidente: "Por definir" };

export const PARTIES: Party[] = [
    { id: "ahora_nacion", name: "Ahora Nación", description: "Partido político peruano", logo: logoMap["Ahora Nación"], candidateImage: "/capictive.png", candidatos: candidatosMap["Ahora Nación"] || defaultCandidatos },
    { id: "alianza_electoral_venceremos", name: "Alianza Electoral Venceremos", description: "Partido político peruano", logo: logoMap["Alianza Electoral Venceremos"], candidateImage: "/capictive.png", candidatos: candidatosMap["Alianza Electoral Venceremos"] || defaultCandidatos },
    { id: "alianza_fuerza_libertad", name: "Alianza Fuerza y Libertad", description: "Partido político peruano", logo: logoMap["Alianza Fuerza y Libertad"], candidateImage: "/capictive.png", candidatos: candidatosMap["Alianza Fuerza y Libertad"] || defaultCandidatos },
    { id: "alianza_para_el_progreso", name: "Alianza Para el Progreso", description: "Partido político peruano", logo: logoMap["Alianza Para el Progreso"], candidateImage: "/capictive.png", candidatos: candidatosMap["Alianza Para el Progreso"] || defaultCandidatos },
    { id: "alianza_unidad_nacional", name: "Alianza Unidad Nacional", description: "Partido político peruano", logo: logoMap["Alianza Unidad Nacional"], candidateImage: "/capictive.png", candidatos: candidatosMap["Alianza Unidad Nacional"] || defaultCandidatos },
    { id: "avanza_pais", name: "Avanza País", description: "Partido político peruano", logo: logoMap["Avanza País"], candidateImage: "/capictive.png", candidatos: candidatosMap["Avanza País"] || defaultCandidatos },
    { id: "cooperacion_popular", name: "Cooperación Popular", description: "Partido político peruano", logo: logoMap["Cooperación Popular"], candidateImage: "/capictive.png", candidatos: candidatosMap["Cooperación Popular"] || defaultCandidatos },
    { id: "frente_de_la_esperanza", name: "Frente de la Esperanza", description: "Partido político peruano", logo: logoMap["Frente de la Esperanza"], candidateImage: "/capictive.png", candidatos: candidatosMap["Frente de la Esperanza"] || defaultCandidatos },
    { id: "fuerza_popular", name: "Fuerza Popular", description: "Partido político peruano", logo: logoMap["Fuerza Popular"], candidateImage: "/capictive.png", candidatos: candidatosMap["Fuerza Popular"] || defaultCandidatos },
    { id: "fe_en_el_peru", name: "Fe en el Perú", description: "Partido político peruano", logo: logoMap["Fe en el Perú"], candidateImage: "/capictive.png", candidatos: candidatosMap["Fe en el Perú"] || defaultCandidatos },
    { id: "integridad_democratica", name: "Integridad Democrática", description: "Partido político peruano", logo: logoMap["Integridad Democrática"], candidateImage: "/capictive.png", candidatos: candidatosMap["Integridad Democrática"] || defaultCandidatos },
    { id: "juntos_por_el_peru", name: "Juntos por el Perú", description: "Partido político peruano", logo: logoMap["Juntos por el Perú"], candidateImage: "/capictive.png", candidatos: candidatosMap["Juntos por el Perú"] || defaultCandidatos },
    { id: "libertad_popular", name: "Libertad Popular", description: "Partido político peruano", logo: logoMap["Libertad Popular"], candidateImage: "/capictive.png", candidatos: candidatosMap["Libertad Popular"] || defaultCandidatos },
    { id: "partido_aprista_peruano", name: "Partido Aprista Peruano", description: "Partido político peruano", logo: logoMap["Partido Aprista Peruano"], candidateImage: "/capictive.png", candidatos: candidatosMap["Partido Aprista Peruano"] || defaultCandidatos },
    { id: "partido_civico_obras", name: "Partido Cívico Obras", description: "Partido político peruano", logo: logoMap["Partido Cívico Obras"], candidateImage: "/capictive.png", candidatos: candidatosMap["Partido Cívico Obras"] || defaultCandidatos },
    { id: "partido_trabajadores_emprendedores_pte_peru", name: "Partido de los Trabajadores y Emprendedores PTE - PERU", description: "Partido político peruano", logo: logoMap["Partido de los Trabajadores y Emprendedores PTE - PERU"], candidateImage: "/capictive.png", candidatos: candidatosMap["Partido de los Trabajadores y Emprendedores PTE - PERU"] || defaultCandidatos },
    { id: "partido_del_buen_gobierno", name: "Partido del Buen Gobierno", description: "Partido político peruano", logo: logoMap["Partido del Buen Gobierno"], candidateImage: "/capictive.png", candidatos: candidatosMap["Partido del Buen Gobierno"] || defaultCandidatos },
    { id: "partido_democratico_federal", name: "Partido Democrático Federal", description: "Partido político peruano", logo: logoMap["Partido Democrático Federal"], candidateImage: "/capictive.png", candidatos: candidatosMap["Partido Democrático Federal"] || defaultCandidatos },
    { id: "partido_democrata_unido_peru", name: "Partido Demócrata Unido Perú", description: "Partido político peruano", logo: logoMap["Partido Demócrata Unido Perú"], candidateImage: "/capictive.png", candidatos: candidatosMap["Partido Demócrata Unido Perú"] || defaultCandidatos },
    { id: "partido_democrata_verde", name: "Partido Demócrata Verde", description: "Partido político peruano", logo: logoMap["Partido Demócrata Verde"], candidateImage: "/capictive.png", candidatos: candidatosMap["Partido Demócrata Verde"] || defaultCandidatos },
    { id: "partido_morado", name: "Partido Morado", description: "Partido político peruano", logo: logoMap["Partido Morado"], candidateImage: "/capictive.png", candidatos: candidatosMap["Partido Morado"] || defaultCandidatos },
    { id: "partido_patriotico_del_peru", name: "Partido Patriótico del Perú", description: "Partido político peruano", logo: logoMap["Partido Patriótico del Perú"], candidateImage: "/capictive.png", candidatos: candidatosMap["Partido Patriótico del Perú"] || defaultCandidatos },
    { id: "partido_politico_prin", name: "Partido Político PRIN", description: "Partido político peruano", logo: logoMap["Partido Político PRIN"], candidateImage: "/capictive.png", candidatos: candidatosMap["Partido Político PRIN"] || defaultCandidatos },
    { id: "pais_para_todos", name: "País para todos", description: "Partido político peruano", logo: logoMap["País para todos"], candidateImage: "/capictive.png", candidatos: candidatosMap["País para todos"] || defaultCandidatos },
    { id: "peru_accion", name: "Perú Acción", description: "Partido político peruano", logo: logoMap["Perú Acción"], candidateImage: "/capictive.png", candidatos: candidatosMap["Perú Acción"] || defaultCandidatos },
    { id: "peru_libre", name: "Perú Libre", description: "Partido político peruano", logo: logoMap["Perú Libre"], candidateImage: "/capictive.png", candidatos: candidatosMap["Perú Libre"] || defaultCandidatos },
    { id: "peru_moderno", name: "Perú Moderno", description: "Partido político peruano", logo: logoMap["Perú Moderno"], candidateImage: "/capictive.png", candidatos: candidatosMap["Perú Moderno"] || defaultCandidatos },
    { id: "peru_primero", name: "Perú Primero", description: "Partido político peruano", logo: logoMap["Perú Primero"], candidateImage: "/capictive.png", candidatos: candidatosMap["Perú Primero"] || defaultCandidatos },
    { id: "podemos_peru", name: "Podemos Perú", description: "Partido político peruano", logo: logoMap["Podemos Perú"], candidateImage: "/capictive.png", candidatos: candidatosMap["Podemos Perú"] || defaultCandidatos },
    { id: "progresemos", name: "Progresemos", description: "Partido político peruano", logo: logoMap["Progresemos"], candidateImage: "/capictive.png", candidatos: candidatosMap["Progresemos"] || defaultCandidatos },
    { id: "renovacion_popular", name: "Renovación Popular", description: "Partido político peruano", logo: logoMap["Renovación Popular"], candidateImage: "/capictive.png", candidatos: candidatosMap["Renovación Popular"] || defaultCandidatos },
    { id: "salvemos_al_peru", name: "Salvemos al Perú", description: "Partido político peruano", logo: logoMap["Salvemos al Perú"], candidateImage: "/capictive.png", candidatos: candidatosMap["Salvemos al Perú"] || defaultCandidatos },
    { id: "sicreo", name: "SiCreo", description: "Partido político peruano", logo: logoMap["SiCreo"], candidateImage: "/capictive.png", candidatos: candidatosMap["SiCreo"] || defaultCandidatos },
    { id: "somos_peru", name: "Somos Perú", description: "Partido político peruano", logo: logoMap["Somos Perú"], candidateImage: "/capictive.png", candidatos: candidatosMap["Somos Perú"] || defaultCandidatos },
    { id: "un_camino_diferente", name: "Un Camino Diferente", description: "Partido político peruano", logo: logoMap["Un Camino Diferente"], candidateImage: "/capictive.png", candidatos: candidatosMap["Un Camino Diferente"] || defaultCandidatos },
];
