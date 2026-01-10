# API de Candidatos Perú 2026

**Base URL:** `https://candidates.capictive.app/`

Actualmente hay **un solo endpoint público** para listar candidatos con paginación y filtros combinables.

---

## Esquema de datos

Tabla `candidatos` en D1:

```sql
CREATE TABLE candidatos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombreCompleto TEXT NOT NULL,
  partido TEXT NOT NULL,
  cargo TEXT NOT NULL,
  numeroCandidato INTEGER,
  postulaDepartamento TEXT,
  resumenHoja TEXT,
  resumenAntecedente TEXT,
  experienciaPolitica INTEGER DEFAULT 0,
  experienciaCongreso INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT (datetime('now'))
);
```

---

## Endpoint principal

### `GET /candidatos`

Listado paginado de candidatos (10 en 10) con filtros opcionales por:

- `postulaDepartamento` (uno o muchos, incluye soporte para `NULL`)
- `partido` (uno o muchos)
- `cargo` (uno o muchos)

**URL completa de ejemplo:**

```text
https://candidates.capictive.app/candidatos?page=2&postulaDepartamento=Lima,Cusco,null&partido=Partido A,Partido B&cargo=Presidente,Congresista
```

#### Query params

| Nombre               | Tipo     | Requerido | Descripción |
|----------------------|----------|-----------|-------------|
| `page`               | number   | ❌        | Número de página (1-based). Por defecto `1`. Paginación fija de 10 ítems por página. |
| `postulaDepartamento`| string[] | ❌        | Departamento(s) al que postula. Puede ser uno o varios valores. Acepta también el literal `null` para incluir registros donde el campo es `NULL`. |
| `partido`            | string[] | ❌        | Nombre(s) de partido. Puede ser uno o varios valores. |
| `cargo`              | string[] | ❌        | Cargo(s) al que postula. Puede ser uno o varios valores. |

**Formas de enviar múltiples valores** (aplica a `postulaDepartamento`, `partido` y `cargo`):

- Repetidos:

  - `?partido=Partido A&partido=Partido B`
  - `?cargo=Presidente&cargo=Congresista`

- Lista separada por comas:

  - `?partido=Partido A,Partido B`
  - `?cargo=Presidente,Congresista`

**Caso especial `postulaDepartamento = NULL`:**

- Usar el literal `null` (case-insensitive):

  - `?postulaDepartamento=null` → solo registros sin departamento
  - `?postulaDepartamento=Lima,null` → Lima **o** sin departamento

#### Comportamiento de filtros

- Si no se manda ningún filtro → devuelve todos los candidatos paginados.
- Entre distintos tipos de filtro (departamento vs partido vs cargo) se combinan con **AND**.
- Dentro de cada grupo (`postulaDepartamento`, `partido`, `cargo`) los valores se combinan con **OR**.

Ejemplos:

- `postulaDepartamento=Lima,Cusco` → candidatos que postulan a **Lima O Cusco**.
- `partido=Partido A,Partido B&cargo=Presidente` → candidatos de **(Partido A O Partido B) Y cargo Presidente**.

---

### Ejemplos de uso

#### 1. Primera página sin filtros

```http
GET https://candidates.capictive.app/candidatos
```

#### 2. Segunda página, solo por departamento

```http
GET https://candidates.capictive.app/candidatos?page=2&postulaDepartamento=Lima
```

#### 3. Varios departamentos, incluyendo `NULL`

```http
GET https://candidates.capictive.app/candidatos?postulaDepartamento=Lima,Cusco,null
```

#### 4. Varios partidos y varios cargos

```http
GET "https://candidates.capictive.app/candidatos?partido=Partido A,Partido B&cargo=Presidente,Congresista"
```

#### 5. Todos los filtros combinados

```http
GET "https://candidates.capictive.app/candidatos?page=3&postulaDepartamento=Lima,null&partido=Partido A&cargo=Presidente,Regidor"
```

---

## Respuesta

Estructura general de la respuesta de `GET /candidatos`:

```json
{
  "page": 1,
  "pageSize": 10,
  "total": 123,
  "totalPages": 13,
  "filters": {
    "postulaDepartamentos": ["Lima", "Cusco"],
    "includeNullPostulaDepartamento": true,
    "partidos": ["Partido A", "Partido B"],
    "cargos": ["Presidente", "Congresista"]
  },
  "data": [
    {
      "id": 1,
      "nombreCompleto": "Juan Pérez",
      "partido": "Partido A",
      "cargo": "Presidente",
      "numeroCandidato": 1,
      "postulaDepartamento": "Lima",
      "resumenHoja": "...",
      "resumenAntecedente": "...",
      "experienciaPolitica": 1,
      "experienciaCongreso": 0,
      "createdAt": "2026-01-10T00:00:00Z"
    }
  ]
}
```

Notas:

- `pageSize` es siempre `10` (fijo).
- `filters` refleja cómo se interpretaron los parámetros enviados.
- Si no hay resultados, `data` será un arreglo vacío y `total` será `0`.

---

## Manejo de errores

Formato general de error:

```json
{
  "error": "mensaje de error"
}
```

Posibles status codes:

| Status | Descripción                    |
|--------|--------------------------------|
| 400    | Petición inválida              |
| 404    | Endpoint no encontrado         |
| 500    | Error interno del servidor     |

---

## CORS

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

Se soportan preflight requests `OPTIONS`, por lo que el frontend puede llamar sin problemas desde navegador.
