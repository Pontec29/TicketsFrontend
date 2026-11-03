import { useState } from 'react';
import { ApiError } from '../services/httpClient';
import { ticketsApi } from '../services/ticketsApi';

// Escrituras sobre tickets: guardar (crear o editar) y cambio rápido de estado.
// Los callbacks le dicen a la pantalla qué hacer cuando termina bien.
export function useTicketActions({ onSaved, onStatusChanged }) {
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [pendingId, setPendingId] = useState(null);
  const [statusError, setStatusError] = useState(null);

  // ticket = null crea uno nuevo; con un ticket, lo edita.
  async function save(ticket, values) {
    setSaving(true);
    setFormErrors({});
    try {
      if (ticket) await ticketsApi.update(ticket.id, values);
      else await ticketsApi.create(values);
      onSaved();
    } catch (err) {
      setFormErrors(toFormErrors(err));
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(ticket, estado) {
    setPendingId(ticket.id);
    setStatusError(null);
    try {
      onStatusChanged(await ticketsApi.changeStatus(ticket.id, estado));
    } catch (err) {
      setStatusError(err.message);
    } finally {
      setPendingId(null);
    }
  }

  return {
    saving,
    formErrors,
    clearFormErrors: () => setFormErrors({}),
    pendingId,
    statusError,
    save,
    changeStatus,
  };
}

// Errores por campo que devolvió la API, más un mensaje general para mostrar arriba del botón.
function toFormErrors(err) {
  if (!(err instanceof ApiError)) return { general: 'Ocurrió un error inesperado.' };
  return { ...err.fieldErrors, general: err.message };
}
