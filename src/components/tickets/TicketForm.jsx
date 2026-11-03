import { useState } from 'react';
import { CANALES, EMPTY_TICKET, ESTADOS, PRIORIDADES } from '../../constants/ticket';
import { validateTicket } from '../../utils/validateTicket';
import FormField from '../common/FormField';

// Formulario controlado para crear (ticket = null) o editar (ticket existente).
// serverErrors: errores por campo que devolvió la API, más "general" para un mensaje global.
export default function TicketForm({ ticket, serverErrors, saving, onSubmit, onCancel }) {
  const isEdit = ticket !== null;
  const [values, setValues] = useState(() => (isEdit ? toFormValues(ticket) : EMPTY_TICKET));
  const [clientErrors, setClientErrors] = useState({});

  // Los errores del servidor tienen prioridad: son los que vio la API al validar de verdad.
  const errors = { ...clientErrors, ...serverErrors };

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const found = validateTicket(values);
    setClientErrors(found);
    if (Object.keys(found).length > 0) return; // no se llama a la API si hay errores locales

    onSubmit({
      ...values,
      titulo: values.titulo.trim(),
      descripcion: values.descripcion.trim() || null,
    });
  }

  return (
    <form className="ticket-form" onSubmit={handleSubmit} noValidate>
      <h2>{isEdit ? 'Editar ticket' : 'Nuevo ticket'}</h2>

      <FormField label="Título" name="titulo" error={errors.titulo}>
        <input id="titulo" name="titulo" value={values.titulo} onChange={handleChange} />
      </FormField>

      <FormField label="Descripción (opcional)" name="descripcion" error={errors.descripcion}>
        <textarea id="descripcion" name="descripcion" rows={3} value={values.descripcion} onChange={handleChange} />
      </FormField>

      <div className="form-row">
        <FormField label="Canal" name="canal" error={errors.canal}>
          <Select id="canal" value={values.canal} options={CANALES} onChange={handleChange} />
        </FormField>
        <FormField label="Estado" name="estado" error={errors.estado}>
          <Select id="estado" value={values.estado} options={ESTADOS} onChange={handleChange} />
        </FormField>
        <FormField label="Prioridad" name="prioridad" error={errors.prioridad}>
          <Select id="prioridad" value={values.prioridad} options={PRIORIDADES} onChange={handleChange} />
        </FormField>
      </div>

      {errors.general && <p className="form-error" role="alert">{errors.general}</p>}

      <div className="form-actions">
        <button type="button" className="secondary" onClick={onCancel} disabled={saving}>Cancelar</button>
        <button type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
      </div>
    </form>
  );
}

function Select({ id, value, options, onChange }) {
  return (
    <select id={id} name={id} value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}

function toFormValues(ticket) {
  return {
    titulo: ticket.titulo,
    descripcion: ticket.descripcion ?? '',
    canal: ticket.canal,
    estado: ticket.estado,
    prioridad: ticket.prioridad,
  };
}
