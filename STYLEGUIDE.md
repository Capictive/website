# Capictive Styleline Guide

Esta guía define la pauta visual por página, utilizando exclusivamente las variables y utilidades de `styles/globals.css`.

## Principios
- Periodista y sobrio: grandes titulares (`font-title`, `text-title`/`text-subtitle`), cuerpo legible (`font-body`).
- Fondo cálido: `bg-primary-background` aplicado a `html`.
- Ritmo editorial: líneas divisorias (`border-subtitle`), bloques con respiro (`card`).
- Acciones claras: `btn-primary` y `btn-secondary`.

## Tipografía
- Títulos: `font-title` (Jost); pesos fuertes `font-bold`/`font-extrabold`.
- Cuerpo: `font-body` (Google Sans) en tamaños de 14–18px.

## Colores
- Título: `text-title` para marcas/cabecera.
- Subtítulo y líneas: `text-subtitle`, `border-subtitle`.
- Botones: `bg-button-background-primary` y `bg-button-background-secondary`.

## Layout global
- Contenedor principal: usar `<main>` que hereda `mx-56`.
- Separaciones: bloques con `border-y` y `py-8–12` para secciones editoriales.

## Navegación
- Componente: `app/components/Nav.tsx`.
- Estados: `nav-selected` y `nav-unselected`.
- Grid: 3 columnas, centrado.

## Página: Inicio
- Cabecera de marca: logo + título grande (`text-[80–100px]`) con `text-title`.
- Cintillo: fecha y meta-información en `font-body` con `text-sm`.
- Titular principal: bloque `border-y`, `text-6xl–8xl`, `font-extrabold`, `text-subtitle`.
- Módulos: usar grid 2/1 (entrevista y hechos), botones `btn-secondary`.
- Footer: redes sociales como botones secundarios.

## Página: Partidos Políticos
- Encabezado: título `text-6xl` en `font-title`, línea divisoria.
- Filtro: `input` con `border-subtitle` y fondo `bg-button-background-secondary/30`.
- Lista horizontal: grid de 5 columnas; cada elemento con `card` y `border-subtitle`.
- Selección: resaltar con `border-button-background-primary`.
- Disposición principal: grid 3 columnas; lista `col-span-1`, detalle `col-span-2`.
- Detalle: columna izquierda con `logo` + imagen 1:1 del candidato; derecha con `h2` + `font-body` y acciones.

## Página: Candidatos
- Mensaje central: `text-6xl` en `font-title` y `text-subtitle`.
- Subtexto divertido en `font-body`.

## Componentes reutilizables
- Botones: `btn-primary` para acciones principales, `btn-secondary` para navegación o enlaces.
- Tarjetas: `card` con padding estándar.

## Accesibilidad
- Contraste con `text-subtitle` y botones.
- `aria-label` en controles de paginación.
- Imágenes `alt` descriptivos.
