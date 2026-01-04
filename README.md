Capictive es una plataforma que busca democratizar la información necesaria para votar correctamente en las elecciones del 2026 en Perú. El enfoque visual es estilo periódico (inspirado en The New York Times), con tipografías y colores definidos en `styles/globals.css`.

## Páginas

- Inicio: portada tipo periódico con fecha, titulares y módulos como Entrevista y Hechos Históricos. Al final se listan las redes sociales `@capictive`.
- Partidos Políticos: lista navegable de partidos (5 por página) con filtro simple. Al seleccionar, se muestra el detalle en un grid (lista ocupa 1 columna, detalle 2 columnas).
- Candidatos: página en construcción con mensaje amigable.

## Variables de estilo (definidas en globals.css)

- Colores: `--color-primary-background`, `--color-title`, `--color-subtitle`, `--color-button-background-primary`, `--color-button-background-secondary`.
- Fuentes: `--font-jost` (títulos), `--font-google-sans` (cuerpo).
- Utilidades: clases `btn-primary`, `btn-secondary`, `nav-selected`, `nav-unselected`, `card`.

## Ejecutar el proyecto

```bash
pnpm install
pnpm dev
```

Luego visita [http://localhost:3000](http://localhost:3000).

## Estructura relevante

- [app/layout.tsx](app/layout.tsx) – configuración global de fuentes y estilos.
- [app/components/Nav.tsx](app/components/Nav.tsx) – navegación superior con selección por ruta.
- [app/page.tsx](app/page.tsx) – Inicio.
- [app/partidos/page.tsx](app/partidos/page.tsx) – Partidos Políticos.
- [app/candidatos/page.tsx](app/candidatos/page.tsx) – Candidatos.
- [app/lib/parties.ts](app/lib/parties.ts) – datos de ejemplo para los partidos.
- [styles/globals.css](styles/globals.css) – tema y utilidades Tailwind.

## Guía de estilo

Consulta [STYLEGUIDE.md](STYLEGUIDE.md) para el lineamiento visual por página y cómo reutilizar las variables.
