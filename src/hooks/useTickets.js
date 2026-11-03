import { useEffect, useState } from 'react';
import { PAGE_SIZE } from '../constants/ticket';
import { ticketsApi } from '../services/ticketsApi';

const NO_FILTERS = { estado: '', canal: '', prioridad: '' };

// Maneja el listado: filtros, paginación y el ciclo de carga (loading / error / ready).
// No sabe nada de formularios ni de cambios de estado: eso lo resuelve useTicketActions.
export function useTickets() {
  const [filters, setFilters] = useState(NO_FILTERS);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ items: [], total: 0 });
  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Se vuelve a pedir la lista cada vez que cambia algo de lo que la define.
  useEffect(() => {
    let ignore = false; // evita aplicar la respuesta de una petición que ya quedó obsoleta

    ticketsApi
      .list({ ...filters, page, pageSize: PAGE_SIZE })
      .then((data) => {
        if (ignore) return;
        setResult(data);
        setError(null);
        setStatus('ready');
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
        setStatus('error');
      });

    return () => {
      ignore = true;
    };
  }, [filters, page, reloadKey]);

  function updateFilters(changes) {
    setStatus('loading');
    setFilters((current) => ({ ...current, ...changes }));
    setPage(1); // un filtro nuevo siempre vuelve a la primera página
  }

  function goToPage(nextPage) {
    setStatus('loading');
    setPage(nextPage);
  }

  function reload() {
    setStatus('loading');
    setReloadKey((key) => key + 1);
  }

  // Reemplaza un ticket en pantalla sin volver a pedir la lista (cambio rápido de estado).
  function replaceTicket(updated) {
    setResult((current) => ({
      ...current,
      items: current.items.map((ticket) => (ticket.id === updated.id ? updated : ticket)),
    }));
  }

  return {
    items: result.items,
    total: result.total,
    page,
    pageSize: PAGE_SIZE,
    filters,
    status,
    error,
    updateFilters,
    goToPage,
    reload,
    replaceTicket,
  };
}
