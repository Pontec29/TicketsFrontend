import { request } from "./httpClient";

export const ticketsApi = {
  // GET /api/tickets?estado=&canal=&prioridad=&page=&pageSize=  ->  { items, total, page, pageSize }
  list: (params) => request(`/api/tickets?${toQueryString(params)}`),

  create: (ticket) => request("/api/tickets", { method: "POST", body: ticket }),

  update: (id, ticket) =>
    request(`/api/tickets/${id}`, { method: "PUT", body: ticket }),


  changeStatus: (id, estado) =>
    request(`/api/tickets/${id}/estado`, { method: "PATCH", body: { estado } }),
};

// Omite los filtros vacíos para no enviar "?estado=" al backend.
function toQueryString(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined)
      query.set(key, value);
  });
  return query.toString();
}
