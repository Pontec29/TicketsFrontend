import { useState } from 'react';
import Pagination from '../components/common/Pagination';
import StateMessage from '../components/common/StateMessage';
import TicketFilters from '../components/tickets/TicketFilters';
import TicketForm from '../components/tickets/TicketForm';
import TicketTable from '../components/tickets/TicketTable';
import { useTicketActions } from '../hooks/useTicketActions';
import { useTickets } from '../hooks/useTickets';

// Pantalla principal: compone los hooks (datos y acciones) con los componentes (dibujo).
export default function TicketsPage() {
  const tickets = useTickets();
  const [editing, setEditing] = useState(null); // null = sin formulario, 'new' = crear, o el ticket a editar

  const actions = useTicketActions({
    onSaved: () => {
      setEditing(null);
      tickets.reload();
    },
    onStatusChanged: tickets.replaceTicket,
  });

  function openForm(target) {
    actions.clearFormErrors();
    setEditing(target);
  }

  function closeForm() {
    actions.clearFormErrors();
    setEditing(null);
  }

  return (
    <main className="container">
      <header className="page-header">
        <h1>Tickets de soporte</h1>
        <button type="button" onClick={() => openForm('new')}>Nuevo ticket</button>
      </header>

      {editing && (
        <TicketForm
          key={editing === 'new' ? 'new' : editing.id}
          ticket={editing === 'new' ? null : editing}
          serverErrors={actions.formErrors}
          saving={actions.saving}
          onSubmit={(values) => actions.save(editing === 'new' ? null : editing, values)}
          onCancel={closeForm}
        />
      )}

      <TicketFilters filters={tickets.filters} onChange={tickets.updateFilters} />

      {actions.statusError && <p className="form-error" role="alert">{actions.statusError}</p>}

      <TicketList tickets={tickets} actions={actions} onEdit={openForm} />
    </main>
  );
}

// Decide qué mostrar según el estado de la carga: cargando, error, lista vacía o la tabla con paginación.
function TicketList({ tickets, actions, onEdit }) {
  if (tickets.status === 'loading') {
    return <StateMessage variant="loading" message="Cargando tickets…" />;
  }
  if (tickets.status === 'error') {
    return <StateMessage variant="error" message={tickets.error} onRetry={tickets.reload} />;
  }
  if (tickets.items.length === 0) {
    return <StateMessage variant="empty" message="No hay tickets para estos filtros." />;
  }

  return (
    <>
      <TicketTable
        items={tickets.items}
        pendingId={actions.pendingId}
        onEdit={onEdit}
        onStatusChange={actions.changeStatus}
      />
      <Pagination
        page={tickets.page}
        pageSize={tickets.pageSize}
        total={tickets.total}
        onChange={tickets.goToPage}
      />
    </>
  );
}
