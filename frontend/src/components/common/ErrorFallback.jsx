function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-center p-4">
      <div className="card-premium p-5 shadow-sm" style={{ maxWidth: '500px' }}>
        <span className="material-symbols-outlined text-danger mb-3" style={{ fontSize: '4rem' }}>
          error
        </span>
        <h1 className="h3 fw-bold mb-3 text-dark">¡Ups! Algo salió mal.</h1>
        <p className="text-muted mb-4">
          Lo sentimos, ha ocurrido un error inesperado al procesar tu solicitud.
        </p>
        {/* <pre className="text-danger small mb-4">{error.message}</pre> */}
        <button className="btn btn-primary px-4 py-2" onClick={resetErrorBoundary}>
          Recargar página
        </button>
      </div>
    </div>
  );
}

export default ErrorFallback;
