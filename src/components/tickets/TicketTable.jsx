import { CANALES, labelOf } from '../../constants/ticket';
import PriorityBadge from './PriorityBadge';
import StatusSelect from './StatusSelect';

// Solo dibuja los tickets que recibe. Los atributos data-label permiten mostrar cada fila como tarjeta en móvil.
export default function TicketTable({ items, pendingId, onEdit, onStatusChange }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Canal</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th><span className="visually-hidden">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map((ticket) => (
            <tr key={ticket.id}>
              <td data-label="Título" className="cell-title">{ticket.titulo}</td>
              <td data-label="Canal">{labelOf(CANALES, ticket.canal)}</td>
              <td data-label="Estado">
                <StatusSelect ticket={ticket} disabled={pendingId === ticket.id} onChange={onStatusChange} />
              </td>
              <td data-label="Prioridad"><PriorityBadge prioridad={ticket.prioridad} /></td>
              <td className="cell-actions">
                <button type="button" className="secondary" onClick={() => onEdit(ticket)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
