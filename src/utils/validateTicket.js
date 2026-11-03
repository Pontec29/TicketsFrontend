import { CANALES, ESTADOS, PRIORIDADES } from "../constants/ticket";

export function validateTicket(values) {
  const errors = {};
  const titulo = values.titulo.trim();

  if (titulo.length < 5)
    errors.titulo = "El título debe tener al menos 5 caracteres.";
  else if (titulo.length > 120)
    errors.titulo = "El título no puede superar 120 caracteres.";

  if (values.descripcion.length > 1000) {
    errors.descripcion = "La descripción no puede superar 1000 caracteres.";
  }

  if (!CANALES.some((c) => c.value === values.canal))
    errors.canal = "Selecciona un canal válido.";
  if (!ESTADOS.some((e) => e.value === values.estado))
    errors.estado = "Selecciona un estado válido.";
  if (!PRIORIDADES.some((p) => p.value === values.prioridad))
    errors.prioridad = "Selecciona una prioridad válida.";

  return errors;
}
