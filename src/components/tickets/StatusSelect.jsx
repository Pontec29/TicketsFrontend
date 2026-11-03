import { ESTADOS } from '../../constants/ticket';

// Cambio rápido de estado: al elegir otro valor se dispara el PATCH sin recargar la página.
export default function StatusSelect({ ticket, disabled, onChange }) {
  return (
    <select
      aria-label={`Estado de ${ticket.titulo}`}
      value={ticket.estado}
      disabled={disabled}
      onChange={(e) => onChange(ticket, e.target.value)}
    >
      {ESTADOS.map((estado) => (
        <option key={estado.value} value={estado.value}>{estado.label}</option>
      ))}
    </select>
  );
}
