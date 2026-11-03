// Mensaje para los tres estados de una lista: cargando, error y vacía.
export default function StateMessage({ variant, message, onRetry }) {
  const isError = variant === 'error';

  return (
    <div className={`state state-${variant}`} role={isError ? 'alert' : 'status'}>
      <p>{message}</p>
      {isError && onRetry && (
        <button type="button" onClick={onRetry}>Reintentar</button>
      )}
    </div>
  );
}
