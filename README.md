# TicketsFrontend

Frontend de la gestión de tickets de soporte. React con JavaScript (sin TypeScript) y Vite. Consume la API de `TicketsAPI`.

## Ejecutar

Requisitos: Node 20 o superior y la API corriendo (por defecto en `http://localhost:5196`).

```bash
cp .env.example .env     # VITE_API_URL=http://localhost:5196
npm install
npm run dev              # http://localhost:5173
```

| Comando | Qué hace |
| :- | :- |
| `npm run dev` | Servidor de desarrollo |
| `npm run lint` | oxlint |
| `npm run build` | Genera `dist/`; `VITE_API_URL` queda incrustada en el bundle |

`VITE_API_URL` es la única configuración. `.env` no se versiona; `.env.example` es la plantilla.

## Cómo está organizado

El flujo va de arriba abajo: la página usa hooks, los hooks usan el servicio, el servicio usa el cliente HTTP.

```
src/
  main.jsx, App.jsx          Punto de entrada
  pages/TicketsPage.jsx      Pantalla: une hooks y componentes
  hooks/
    useTickets.js            Lista, filtros, paginación y carga (loading/error/ready)
    useTicketActions.js      Guardar (crear/editar) y cambio rápido de estado
  components/
    tickets/                 TicketFilters, TicketTable, TicketForm, StatusSelect, PriorityBadge
    common/                  StateMessage, Pagination, FormField (reutilizables)
  services/
    httpClient.js            fetch + manejo de errores (ApiError)
    ticketsApi.js            Un método por endpoint
  utils/validateTicket.js    Validaciones del formulario (mismas reglas que el backend)
  constants/ticket.js        Canales, estados, prioridades y tamaño de página
  config/env.js              Lectura de VITE_API_URL
```

## Qué cumple de la prueba

- **Listado:** tabla con título, canal, estado y prioridad; filtros por estado, canal y prioridad; paginación; indicadores de carga, error (con "Reintentar") y lista vacía.
- **Formulario de creación y edición:** controlado, con validación en el cliente (título 5 a 120, descripción hasta 1000, valores permitidos), botón deshabilitado mientras guarda y los errores de la API mostrados bajo cada campo.
- **Cambio rápido de estado:** desde la tabla, con un `PATCH` que actualiza solo esa fila sin recargar la página.
- **Arquitectura:** componentes pequeños, hooks para el estado, capa de servicio para HTTP y la URL de la API tomada de `VITE_API_URL`.

## Endpoints que usa

| Acción | Endpoint |
| :- | :- |
| Listar | `GET /api/tickets?estado=&canal=&prioridad=&page=&pageSize=` |
| Crear | `POST /api/tickets` |
| Editar | `PUT /api/tickets/{id}` |
| Cambiar estado | `PATCH /api/tickets/{id}/estado` |

## Despliegue

Publicado en Azure Static Web Apps (Free): https://red-plant-07021450f.6.azurestaticapps.net/

Se compila con `VITE_API_URL` apuntando a la API de Azure (`npm run build`) y se sube `dist/`. La API acepta ese origen por CORS en `Cors__AllowedOrigins__0`.
