# Pasos a Seguir

*Construcción del Capictive.app*

## Lista de Partidos Politicos

Primero dejamos en claro cuales son los partidos politicos que tenemos acceso, estos son los siguientes:
-  ['Ahora Nación', 'Alianza Electoral Venceremos', 'Alianza Fuerza y Libertad', 'Alianza Para el Progreso', 'Alianza Unidad Nacional', 'Avanza País', 'Cooperación Popular', 'Frente de la Esperanza', 'Fuerza Popular', 'Integrida Democrática', 'Juntos por el Perú', 'Libertad Popular', 'Partido Aprista Peruano', 'Partido Cívico Obras', 'Partido de los Trabajadores y Emprendedores PTE - PERU', 'Partido del Buen Gobierno', 'Partido Democrático Federal', 'Partido Demócrata Unido Perú', 'Partido Demócrata Verde', 'Partido Morado', 'Partido Patriótico del Perú', 'Partido Político PRIN', 'País para todos', 'Perú Acción', 'Perú Libre', 'Perú Moderno', 'Perú Primero', 'Podemos Perú', 'Progresemos', 'Renovación Popular', 'Salvemos al Perú', 'SiCreo', 'Somos Perú', 'Un Camino Diferente']

## Tareas

1. Necesitamos conectar nuestra API y Documentos a la aplicación, para eso tienes estos dos endpoints:
    - https://api.capictive.app/: Conectará todos los datos de nuestra busqueda de información y se te entregará un JSON con un formato especifico, en breves se te mostrará dicho formato.
    - https://files.capictive.app/: Aquí tendrás los documentos en mención, estos son invocados tales que <endpoint>/Partidos%20Politicos/<Nombre del Partido>/PLAN%20RESUMEN.pdf o ***/PLAN GOBIERNO.pdf

2. Tenemos que completar las paginas que tenemos:
    - Partidos Politicos: Aquí íra la mayoria de datos del api, dentro del 2do grid eres libre de colocar el diseño que desees, pero si puedes respetar la visión inicial como un periodico, perfecto, pero debes procurar colocar todos los datos necesarios dentro de la página.

## Formato API

Nuestro api se llama tal que así https://api.capictive.app/?id=<Nombre del Partido Politico> algo como **/?id="Renovación Popular" (sin esas comillas, solo para demostrar que va junto ambas palabras), y el tipo de datos que te devuelve es tal que:
```
{
  "partido": "Renovación Popular",
  "slogan_detectado": "Revalorarnos como ciudadanos de primera",
  "vision_resumen": "Visión humanista y cristiana que busca un Estado eficiente y descentralizado, priorizando la soberanía, la familia y la reactivación económica mediante grandes obras de infraestructura.",
  "ejes": [
    {
      "categoria": "SEGURIDAD Y JUSTICIA",
      "propuesta_estrella": "Crear una Central de Lucha Contra la Corrupción (CCC) con plenos poderes para infiltrar agentes y un convenio de inteligencia con EE.UU.",
      "que_proponen": [
        "Fundar la 'CCC' con capacidad de usar agentes encubiertos para capturar delitos en flagrancia.",
        "Unidades Itinerantes de Pacificación Ciudadana para combatir pandillaje y extorsión.",
        "Firmar convenio con Estados Unidos para inteligencia, tecnología y extradición inmediata de cabecillas.",
        "Militarizar fronteras y zonas críticas (VRAEM, Putumayo) terminando su pacificación."
      ],
      "dato_curioso": "El plan menciona explícitamente un 'Convenio con el Gobierno de Estados Unidos' para servicios de inteligencia y extradición (Pág. 3).",
      "para_reflexionar": "¿Crees que dar 'plenos poderes' a una central anticorrupción garantiza limpieza o podría generar riesgos de abuso de poder?",
      "benchmark_internacional": {
        "codigo_pais": "HKG",
        "caso_similar": "Comisión Independiente Contra la Corrupción (ICAC) - Hong Kong 1974",
        "descripcion": "Hong Kong creó una agencia independiente con poderes extraordinarios de investigación y detención, separada de la policía.",
        "leccion": "La independencia total del poder político y policial fue clave para pasar de ser una ciudad corrupta a una de las más limpias.",
        "nivel_similitud": "ALTO"
      },
      "fuente_pagina": "Pág. 3 y 11"
    },
    {
      "categoria": "INFRAESTRUCTURA Y TRANSPORTE",
      "propuesta_estrella": "Construcción de un Tren Ferroviario de Tumbes a Tacna y un Tren Bioceánico que conecte el Atlántico con el Pacífico.",
      "que_proponen": [
        "Construir una línea ferroviaria a lo largo de toda la costa (Tumbes-Tacna).",
        "Impulsar el Tren Bioceánico para carga internacional.",
        "Ampliar el Metropolitano y las líneas del Metro en Lima.",
        "Construir autopistas de cuatro carriles en la Red Vial Nacional usando batallones de ingeniería de las FF.AA."
      ],
      "dato_curioso": "Prometen concluir el Tren Tumbes-Tacna exactamente 'al 5to año de nuestro Gobierno' (Pág. 19).",
      "para_reflexionar": "Considerando que la Línea 2 del Metro lleva años de retraso, ¿cómo impactaría en tu vida si un tren costero se logra en 5 años?",
      "benchmark_internacional": {
        "codigo_pais": "ESP",
        "caso_similar": "Corredor Mediterráneo - España (En construcción)",
        "descripcion": "España lleva décadas impulsando un corredor ferroviario para conectar sus puertos y ciudades costeras (similar a Tumbes-Tacna) para potenciar la exportación.",
        "leccion": "Estos proyectos son motores económicos potentes pero suelen enfrentar grandes desafíos de presupuesto y tiempo de ejecución.",
        "nivel_similitud": "MEDIO"
      },
      "fuente_pagina": "Pág. 18 y 19"
    },
    {
      "categoria": "ECONOMÍA Y EMPLEO",
      "propuesta_estrella": "Reducción de impuestos (IGV) para formalizar y creación del 'Banco PYME' para financiar a pequeños empresarios.",
      "que_proponen": [
        "Bajar la tasa del IGV (Impuesto General a las Ventas) para que los informales se formalicen.",
        "Crear el 'Banco PYME' con capital privado para dar créditos a emprendedores.",
        "Eliminar exoneraciones tributarias para ampliar la base de recaudación.",
        "Crear Zonas Francas (libres de impuestos) en fronteras y zonas turísticas."
      ],
      "dato_curioso": "Proyectan terminar el mandato con una inflación inferior al 2.5% y un crecimiento del PBI del 7% anual (Pág. 25).",
      "para_reflexionar": "¿Bajar el IGV haría que pidas boleta más seguido o crees que los precios seguirían igual?",
      "benchmark_internacional": {
        "codigo_pais": "USA",
        "caso_similar": "Taxpayer Bill of Rights - Estados Unidos 1996",
        "descripcion": "Se propone una 'Ley del Contribuyente' similar a la de EE.UU., que protege al ciudadano de abusos de la entidad recaudadora (IRS/SUNAT).",
        "leccion": "Equilibrar el poder entre el recaudador y el ciudadano aumenta la confianza y el cumplimiento voluntario.",
        "nivel_similitud": "ALTO"
      },
      "fuente_pagina": "Pág. 14, 15 y 16"
    },
    {
      "categoria": "GESTIÓN PÚBLICA",
      "propuesta_estrella": "Reducir el número de ministerios y eliminar trabas burocráticas.",
      "que_proponen": [
        "Fusión o eliminación de ministerios para reducir burocracia.",
        "Implementar un 'Código del Servicio Público' con sanciones por mal servicio.",
        "Jueces y fiscales provisionales serán reducidos; ingreso por estricto mérito.",
        "Titulación y saneamiento físico legal masivo."
      ],
      "dato_curioso": "El plan cita que el Estado tiene un 'sobredimensionamiento de la burocracia' y alto gasto corriente en asesorías 'sin sustento técnico' (Pág. 9).",
      "para_reflexionar": "¿Prefieres un Estado más pequeño y barato o uno más grande con más servicios?",
      "benchmark_internacional": {
        "codigo_pais": "EST",
        "caso_similar": "Reforma Digital y Administrativa - Estonia 2000s",
        "descripcion": "Estonia redujo su burocracia física drásticamente digitalizando el 99% de los servicios estatales (X-Road).",
        "leccion": "La eficiencia no solo depende de eliminar ministerios, sino de interconectar digitalmente los datos para evitar trámites.",
        "nivel_similitud": "MEDIO"
      },
      "fuente_pagina": "Pág. 8, 9 y 10"
    }
  ],
  "lo_que_no_dicen": "Aunque proponen megaobras ferroviarias (Tren Costero y Bioceánico), el plan no detalla el origen específico de los miles de millones de dólares necesarios para financiarlas (deuda, concesión, impuestos) ni el estudio de impacto ambiental detallado para atravesar la Amazonía y la Costa. Tampoco se menciona una estrategia profunda de reforma universitaria (SUNEDU) más allá de 'investigación agrícola'.",
  "fuentes_consultadas": [
    "Plan de Gobierno Renovación Popular 2026-2031 (PDF adjunto)",
    "ICAC Hong Kong - Historia y Reportes Anuales",
    "Banco Mundial - Datos sobre infraestructura ferroviaria y costos",
    "IRS - Taxpayer Bill of Rights (United States)"
  ],
  "presidente_links": [
    "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767744127/Capictive/Portrait/renovacion_popular_portrait.png"
  ],
  "logo_links": [
    "https://res.cloudinary.com/dzcjiie9l/image/upload/v1767743047/Capictive/Logo/renovacion_popular_logo.png"
  ],
}
```

Ve viendo ese formato e integralo dentro del codigo.

