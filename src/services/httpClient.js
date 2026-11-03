import { API_URL } from '../config/env';

// Error que lanza todo el servicio HTTP. Las pantallas solo necesitan leer estos tres campos:
// message (para mostrar), status (código HTTP, 0 si no hubo respuesta) y fieldErrors (por campo).
export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors = {} } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function request(path, { method = 'GET', body } = {}) {
  if (!API_URL) {
    throw new ApiError('Falta configurar VITE_API_URL en el archivo .env.');
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Revisa tu conexión o que la API esté activa.');
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) throw toApiError(response.status, data);

  return data;
}

// La API responde ProblemDetails (RFC 7807): "detail"/"title" para el mensaje y "errors" por campo.
function toApiError(status, problem) {
  const fieldErrors = toFieldErrors(problem?.errors);
  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  const message = hasFieldErrors
    ? 'Revisa los campos marcados.'
    : (problem?.detail ?? problem?.title ?? `Error inesperado (${status}).`);

  return new ApiError(message, { status, fieldErrors });
}

// El backend envía las claves como "Titulo"; el formulario usa "titulo".
function toFieldErrors(errors = {}) {
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [
      field.charAt(0).toLowerCase() + field.slice(1),
      messages[0],
    ]),
  );
}
