export interface PoliticalParty {
  id: string;
  name: string;
  logo: string;
  portrait?: string; // Solo para presidente si existe
}

// Helper para generar IDs basados en el nombre del archivo
const partiesData = [
  { file: "ahora_nacion_logo.png", name: "AHORA NACIÓN" },
  { file: "alianza_electoral_venceremos_logo.jpg", name: "ALIANZA ELECTORAL VENCEREMOS" },
  { file: "alianza_fuerza_y_libertad_logo.png", name: "ALIANZA FUERZA Y LIBERTAD" },
  { file: "alianza_para_el_progreso_logo.png", name: "ALIANZA PARA EL PROGRESO" },
  { file: "alianza_unidad_nacional_logo.jpg", name: "ALIANZA UNIDAD NACIONAL" },
  { file: "avanza_pais_logo.png", name: "AVANZA PAÍS" },
  { file: "cooperacion_popular_logo.png", name: "COOPERACIÓN POPULAR" },
  { file: "fe_en_el_peru_logo.png", name: "FE EN EL PERÚ" },
  { file: "frente_de_la_esperanza_logo.png", name: "FRENTE DE LA ESPERANZA" },
  { file: "fuerza_popular_logo.png", name: "FUERZA POPULAR" },
  { file: "integrida_democratica_logo.jpg", name: "INTEGRIDAD DEMOCRÁTICA" },
  { file: "juntos_por_el_peru_logo.png", name: "JUNTOS POR EL PERÚ" },
  { file: "libertad_popular_logo.jpg", name: "LIBERTAD POPULAR" },
  { file: "pais_para_todos_logo.png", name: "PAÍS PARA TODOS" },
  { file: "partido_aprista_peruano_logo.png", name: "PARTIDO APRISTA PERUANO" },
  { file: "partido_civico_obras_logo.png", name: "PARTIDO CÍVICO OBRAS" },
  { file: "partido_de_los_trabajadores_y_emprendedores_pte_-_peru_logo.jpg", name: "P. TRABAJADORES Y EMPRENDEDORES" },
  { file: "partido_del_buen_gobierno_logo.jpg", name: "PARTIDO DEL BUEN GOBIERNO" },
  { file: "partido_democrata_unido_peru_logo.jpg", name: "PARTIDO DEMÓCRATA UNIDO PERÚ" },
  { file: "partido_democrata_verde_logo.png", name: "PARTIDO DEMÓCRATA VERDE" },
  { file: "partido_democratico_federal_logo.png", name: "PARTIDO DEMOCRÁTICO FEDERAL" },
  { file: "partido_morado_logo.png", name: "PARTIDO MORADO" },
  { file: "partido_patriotico_del_peru_logo.png", name: "PARTIDO PATRIÓTICO DEL PERÚ" },
  { file: "partido_politico_prin_logo.png", name: "PARTIDO POLÍTICO PRIN" },
  { file: "peru_accion_logo.png", name: "PERÚ ACCIÓN" },
  { file: "peru_libre_logo.png", name: "PERÚ LIBRE" },
  { file: "peru_moderno_logo.jpg", name: "PERÚ MODERNO" },
  { file: "peru_primero_logo.png", name: "PERÚ PRIMERO" },
  { file: "podemos_peru_logo.png", name: "PODEMOS PERÚ" },
  { file: "progresemos_logo.jpg", name: "PROGRESEMOS" },
  { file: "renovacion_popular_logo.png", name: "RENOVACIÓN POPULAR" },
  { file: "salvemos_al_peru_logo.png", name: "SALVEMOS AL PERÚ" },
  { file: "sicreo_logo.png", name: "SÍ CREO" },
  { file: "somos_peru_logo.svg", name: "SOMOS PERÚ" },
  { file: "un_camino_diferente_logo.jpg", name: "UN CAMINO DIFERENTE" }
];

export const mockParties: PoliticalParty[] = partiesData.map((p, index) => {
  // Construimos el nombre del archivo de retrato asumiendo la convención _portrait
  // Reemplazamos _logo con _portrait y mantenemos la extensión original o probamos jpg
  const baseName = p.file.replace(/_logo\.(png|jpg|svg)$/, "");
  
  return {
    id: `party-${index}`,
    name: p.name,
    logo: `/political parties/${p.file}`,
    // Asumimos que todos tienen retrato jpg para simplificar, el componente manejará el fallback si falla
    portrait: `/portraits/${baseName}_portrait.jpg`
  };
});
