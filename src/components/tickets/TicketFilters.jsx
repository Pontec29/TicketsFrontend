import { CANALES, ESTADOS, PRIORIDADES } from '../../constants/ticket';

// Componente controlado: no guarda estado, solo avisa qué filtro cambió.
export default function TicketFilters({ filters, onChange }) {
  return (
    <div className="filters">
      <FilterSelect label="Estado" allLabel="Todos" value={filters.estado} options={ESTADOS}
        onChange={(estado) => onChange({ estado })} />
      <FilterSelect label="Canal" allLabel="Todos" value={filters.canal} options={CANALES}
        onChange={(canal) => onChange({ canal })} />
      <FilterSelect label="Prioridad" allLabel="Todas" value={filters.prioridad} options={PRIORIDADES}
        onChange={(prioridad) => onChange({ prioridad })} />
    </div>
  );
}

function FilterSelect({ label, allLabel, value, options, onChange }) {
  return (
    <label>
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
