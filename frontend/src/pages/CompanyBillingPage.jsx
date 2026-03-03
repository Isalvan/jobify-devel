
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { gastoService } from '../services/gastoService';
import { userService } from '../services/userService';
import { AppContext } from '../contexts/AppProvider';

function CompanyBillingPage() {
    const { user } = useContext(AppContext);
    const [gastos, setGastos] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pagado: 0,
        pendiente: 0,
        cancelado: 0,
        count: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [credits, setCredits] = useState(0);

    useEffect(() => {
        if (user && user.empresa) {
            loadData();
        }
    }, [user, page]);

    const loadData = async () => {
        setLoading(true);
        try {
            const empresaId = user.empresa.id;

            // Load stats
            const statsRes = await gastoService.getStats({ empresa_id: empresaId });
            setStats(statsRes.data || statsRes);

            // Load fresh company data (credits)
            const empresaRes = await userService.getEmpresa(empresaId);
            const freshEmpresa = empresaRes.data || empresaRes;

            // Si funciona, actualizamos el contexto (opcional, pero útil)
            // pero por ahora usamos estado local para visualización
            if (user.empresa && freshEmpresa.impresiones_restantes !== undefined) {
                user.empresa.impresiones_restantes = freshEmpresa.impresiones_restantes;
                setCredits(freshEmpresa.impresiones_restantes);
            }

            // Load expenses
            const gastosRes = await gastoService.getGastos({
                empresa_id: empresaId,
                page: page,
                per_page: 10
            });

            setGastos(gastosRes.data || []);
            setTotalPages(gastosRes.data.last_page || 1); // Adjust based on actual API response structure if needed
            if (gastosRes.last_page) setTotalPages(gastosRes.last_page);

        } catch (err) {
            console.error(err);
            setError("Error al cargar los datos de facturación.");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const StatusBadge = ({ status }) => {
        let className = 'bg-secondary';
        if (status === 'PAGADO') className = 'bg-success';
        if (status === 'PENDIENTE') className = 'bg-warning text-dark';
        if (status === 'CANCELADO') className = 'bg-danger';

        return <span className={`badge ${className} rounded-pill`}>{status}</span>;
    };

    if (!user || user.rol !== 'EMPRESA') {
        return (
            <div className="container py-5 text-center">
                <h3>Acceso denegado</h3>
                <p>Esta página es solo para empresas.</p>
                <Link to="/" className="btn btn-primary">Volver al inicio</Link>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 fw-bold mb-0">Facturación y Créditos</h1>
                <Link to={`/perfil/${user.id}`} className="btn btn-outline-primary">
                    <span className="material-symbols-outlined align-middle me-1">arrow_back</span>
                    Volver al Perfil
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card-premium p-4 h-100 border-start border-4 border-primary">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <h6 className="text-muted text-uppercase small fw-bold mb-0">Total Gastado</h6>
                            <span className="material-symbols-outlined text-primary fs-3 opacity-50">payments</span>
                        </div>
                        <h2 className="display-6 fw-bold text-dark mb-0">{formatCurrency(stats.total)}</h2>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card-premium p-4 h-100 border-start border-4 border-warning">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <h6 className="text-muted text-uppercase small fw-bold mb-0">Créditos Disponibles</h6>
                            <span className="material-symbols-outlined text-warning fs-3 opacity-50">monetization_on</span>
                        </div>
                        <h2 className="display-6 fw-bold text-dark mb-0">{credits}</h2>
                        <small className="text-muted">Impresiones para destacar ofertas</small>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card-premium p-4 h-100 border-start border-4 border-success">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <h6 className="text-muted text-uppercase small fw-bold mb-0">Última Actividad</h6>
                            <span className="material-symbols-outlined text-success fs-3 opacity-50">history</span>
                        </div>
                        <h2 className="h4 fw-bold text-dark mb-0">
                            {gastos.length > 0 ? new Date(gastos[0].fecha).toLocaleDateString() : 'N/A'}
                        </h2>
                        <small className="text-muted">Fecha del último movimiento</small>
                    </div>
                </div>
            </div>

            {/* Expenses Table */}
            <div className="card-premium p-4">
                <h2 className="h5 fw-bold mb-4">Historial de Movimientos</h2>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : gastos.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <span className="material-symbols-outlined fs-1 mb-2 opacity-50">receipt_long</span>
                        <p>No hay movimientos registrados.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Concepto</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th className="text-end">Importe</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gastos.map(gasto => (
                                    <tr key={gasto.id}>
                                        <td className="fw-medium">{gasto.concepto}</td>
                                        <td>{new Date(gasto.fecha).toLocaleDateString()}</td>
                                        <td><StatusBadge status={gasto.estado} /></td>
                                        <td className="text-end fw-bold">{formatCurrency(gasto.cantidad)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination - Simple Implementation */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4 gap-2">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Anterior
                        </button>
                        <span className="align-self-center text-muted small">Página {page} de {totalPages}</span>
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CompanyBillingPage;
