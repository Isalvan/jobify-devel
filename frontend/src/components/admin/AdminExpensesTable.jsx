import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { gastoService } from '../../services/gastoService';
import { companyService } from '../../services/companyService';
import { userService } from '../../services/userService';
import CommonPagination from './CommonPagination';

function AdminExpensesTable() {
    const [gastos, setGastos] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        count: 0,
        pagado: 0,
        pendiente: 0,
        cancelado: 0
    });
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [editingGasto, setEditingGasto] = useState(null);

    // Filters, Search & Pagination
    const [filterCompany, setFilterCompany] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);

    // Form State for Gasto
    const [formData, setFormData] = useState({
        empresa_id: '',
        concepto: '',
        cantidad: '',
        fecha: new Date().toISOString().split('T')[0],
        estado: 'PAGADO',
        notas: ''
    });

    // Form State for Credits
    const [creditData, setCreditData] = useState({
        empresa_id: '',
        amount: 500
    });

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        loadData();
        loadStats();
    }, [filterCompany, debouncedSearch, page]);

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            const res = await companyService.getCompanies({ all: 1 });
            setCompanies(res.data || res || []);
        } catch (err) {
            console.error('Error loading companies:', err);
        }
    };

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                page: page,
                per_page: 15,
                search: debouncedSearch
            };
            if (filterCompany) params.empresa_id = filterCompany;

            const res = await gastoService.getGastos(params);

            if (res.meta) {
                setGastos(res.data || []);
                setPagination(res.meta);
            } else if (res.current_page) {
                // Support for standard Laravel Paginator (without Resource wrapper)
                setGastos(res.data || []);
                setPagination(res); 
            } else {
                setGastos(res.data || res || []);
                setPagination(null);
            }
        } catch (err) {
            console.error(err);
            setError('Error al cargar historial. Verifica la conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        setStatsLoading(true);
        try {
            const params = {};
            if (filterCompany) params.empresa_id = filterCompany;
            const res = await gastoService.getStats(params);
            setStats(res);
        } catch (err) {
            console.error('Error loading stats:', err);
        } finally {
            setStatsLoading(false);
        }
    };

    const handleAddCredits = (empresaId = '') => {
        const id = empresaId || filterCompany || '';
        setCreditData({ empresa_id: id, amount: 500 });
        setShowCreditModal(true);
    };

    const submitCredits = async (e) => {
        e.preventDefault();
        if (!creditData.empresa_id) return alert('Por favor, selecciona una empresa.');
        try {
            await userService.addCredits(creditData.empresa_id, creditData.amount);
            setShowCreditModal(false);
            loadData();
            loadStats();
            loadCompanies();
            alert('¡Saldo añadido correctamente!');
        } catch (err) {
            alert('Error al añadir saldo. Inténtalo de nuevo.');
        }
    };

    const handleCreateGasto = () => {
        setEditingGasto(null);
        setFormData({
            empresa_id: filterCompany || '',
            concepto: '',
            cantidad: '',
            fecha: new Date().toISOString().split('T')[0],
            estado: 'PAGADO',
            notas: ''
        });
        setShowModal(true);
    };

    const handleEdit = (gasto) => {
        setEditingGasto(gasto);
        setFormData({
            empresa_id: gasto.empresa_id,
            concepto: gasto.concepto,
            cantidad: gasto.cantidad,
            fecha: gasto.fecha,
            estado: gasto.estado,
            notas: gasto.notas || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este registro histórico?')) return;
        try {
            await gastoService.deleteGasto(id);
            loadData();
            loadStats();
        } catch (err) {
            alert('Error al eliminar registro.');
        }
    };

    const handleSubmitGasto = async (e) => {
        e.preventDefault();
        if (!formData.empresa_id) return alert('Selecciona una empresa.');
        try {
            if (editingGasto) {
                await gastoService.updateGasto(editingGasto.id, formData);
            } else {
                await gastoService.createGasto(formData);
            }
            setShowModal(false);
            loadData();
            loadStats();
        } catch (err) {
            alert('Error al guardar registro manual.');
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value || 0);
    };

    const selectedCompanyObj = companies.find(c => c.id == filterCompany);

    return (
        <>
            <div className="animate-fade-in p-1">
                {/* Summary Row */}
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <div className="card-premium h-100 p-3 bg-white border shadow-sm rounded-4">
                            <p className="text-muted small text-uppercase fw-bold mb-1">Empresa</p>
                            <select
                                className="form-select border-0 bg-light fw-bold"
                                value={filterCompany}
                                onChange={(e) => { setFilterCompany(e.target.value); setPage(1); }}
                            >
                                <option value="">Todas las empresas</option>
                                {companies.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre || `ID: ${c.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card-premium h-100 p-3 bg-white border shadow-sm rounded-4 text-center">
                            <p className="text-muted small text-uppercase fw-bold mb-1">Saldo Actual</p>
                            <h4 className="fw-bold mb-0 text-primary">
                                {filterCompany ? (
                                    <>
                                        {(selectedCompanyObj?.impresiones_restantes || 0).toLocaleString()}
                                        <span className="small ms-1">CRÉD.</span>
                                    </>
                                ) : (
                                    <span className="text-muted opacity-50">---</span>
                                )}
                            </h4>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card-premium h-100 p-3 bg-white border shadow-sm rounded-4 text-center">
                            <p className="text-muted small text-uppercase fw-bold mb-1">Total Movimientos</p>
                            <h4 className="fw-bold mb-0">{statsLoading ? '...' : formatCurrency(stats.total)}</h4>
                        </div>
                    </div>
                    <div className="col-md-3 d-grid">
                        <button onClick={() => handleAddCredits()} className="btn btn-premium rounded-4 shadow-sm">
                            <span className="material-symbols-outlined me-2 text-white">add_card</span>
                            Gestionar Saldo
                        </button>
                        <button onClick={handleCreateGasto} className="btn btn-link link-secondary btn-sm p-0 mt-1">
                            Añadir gasto manual
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-4">
                    <div className="input-group-premium p-1 pe-3 border shadow-sm bg-white rounded-4">
                        <span className="material-symbols-outlined ms-3 text-muted">search</span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por concepto o empresa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="btn btn-link text-muted p-0" onClick={() => setSearchTerm('')}>
                                <span className="material-symbols-outlined fs-5">close</span>
                            </button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center rounded-4">
                        <span className="material-symbols-outlined me-2">error</span>
                        {error}
                    </div>
                )}

                {loading && !gastos.length ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : (
                    <>
                        <div className="card-premium border-0 shadow-sm overflow-hidden p-0 rounded-4">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr className="text-muted small text-uppercase">
                                            <th className="ps-4 py-3">Fecha</th>
                                            <th>Empresa</th>
                                            <th>Concepto</th>
                                            <th>Cantidad / Créditos</th>
                                            <th className="text-end pe-4">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gastos.length > 0 ? (
                                            gastos.map(gasto => (
                                                <tr key={gasto.id}>
                                                    <td className="ps-4 fw-medium text-muted small">{new Date(gasto.fecha).toLocaleDateString()}</td>
                                                    <td>
                                                        <div className="d-flex flex-column">
                                                            <span className="fw-bold text-dark">{gasto.empresa?.usuario?.nombre || gasto.empresa?.nombre || 'ID: ' + gasto.empresa_id}</span>
                                                            <span className="text-muted extra-small">ID Empresa: #{gasto.empresa_id}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={gasto.concepto?.includes('Créditos') ? 'text-success-emphasis fw-semibold' : ''}>
                                                            {gasto.concepto}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`fw-bold ${gasto.concepto?.includes('Créditos') ? 'text-success' : ''}`}>
                                                            {gasto.concepto?.includes('Créditos') ? '+' : ''}
                                                            {parseFloat(gasto.cantidad).toLocaleString()}
                                                            <span className="small ms-1 opacity-75">unid/€</span>
                                                        </span>
                                                    </td>
                                                    <td className="text-end pe-4">
                                                        <div className="d-flex gap-2 justify-content-end">
                                                            <button className="btn btn-sm btn-light border-0" onClick={() => handleEdit(gasto)} title="Editar">
                                                                <span className="material-symbols-outlined fs-5">edit</span>
                                                            </button>
                                                            <button className="btn btn-sm btn-light text-danger border-0" onClick={() => handleDelete(gasto.id)} title="Eliminar">
                                                                <span className="material-symbols-outlined fs-5">delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5 text-muted">Aún no hay transacciones registradas.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <CommonPagination
                            pagination={pagination}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    </>
                )}
            </div>

            {/* Modals: Render outside the transformed container using Portals */}
            {showCreditModal && createPortal(
                <div className="modal-custom-overlay" onClick={() => setShowCreditModal(false)}>
                    <div className="modal-custom-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content border-0 shadow-lg rounded-4 bg-white overflow-hidden">
                            <div className="modal-header border-0 pb-0 px-4 pt-4">
                                <h5 className="modal-title fw-bold">Gestión de Saldo Corporativo</h5>
                                <button type="button" className="btn-close" onClick={() => setShowCreditModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <form onSubmit={submitCredits}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Empresa Destinataria</label>
                                        <select
                                            className="form-select border-2 p-3 rounded-3"
                                            value={creditData.empresa_id}
                                            onChange={(e) => setCreditData({ ...creditData, empresa_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Selecciona una empresa...</option>
                                            {companies.map(c => (
                                                <option key={c.id} value={c.id}>
                                                    {c.nombre || `Empresa #${c.id}`} (Saldo Actual: {c.impresiones_restantes} créd.)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold text-muted">Cantidad de Créditos (Impresiones)</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control border-2 p-3 fs-3 fw-bold text-center"
                                                value={creditData.amount}
                                                onChange={(e) => setCreditData({ ...creditData, amount: e.target.value })}
                                                required
                                                min="1"
                                            />
                                            <span className="input-group-text bg-primary text-white border-0 px-4">CR</span>
                                        </div>
                                    </div>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-premium btn-lg rounded-3 py-3 shadow">Cargar Saldo</button>
                                        <button type="button" className="btn btn-link text-muted" onClick={() => setShowCreditModal(false)}>Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {showModal && createPortal(
                <div className="modal-custom-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-custom-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content border-0 shadow-lg rounded-4 bg-white overflow-hidden">
                            <div className="modal-header px-4 pt-4 border-0">
                                <h5 className="modal-title fw-bold">{editingGasto ? 'Editar Registro' : 'Añadir Registro Manual'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <form onSubmit={handleSubmitGasto}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Empresa</label>
                                        <select
                                            className="form-select border-2 rounded-3"
                                            value={formData.empresa_id}
                                            onChange={(e) => setFormData({ ...formData, empresa_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Seleccionar empresa...</option>
                                            {companies.map(c => (
                                                <option key={c.id} value={c.id}>{c.nombre || `ID: ${c.id}`}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Concepto</label>
                                        <input className="form-control border-2 rounded-3" type="text" value={formData.concepto} onChange={(e) => setFormData({ ...formData, concepto: e.target.value })} required placeholder="Ej: Pago de servicios externos" />
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="form-label small fw-bold text-muted">Monto / Créditos</label>
                                            <input className="form-control border-2 rounded-3" type="number" step="0.01" value={formData.cantidad} onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })} required />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold text-muted">Fecha</label>
                                            <input className="form-control border-2 rounded-3" type="date" value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="d-grid gap-2 mt-4">
                                        <button type="submit" className="btn btn-primary rounded-3 py-3 fw-bold">Guardar Registro</button>
                                        <button type="button" className="btn btn-light rounded-3 py-2" onClick={() => setShowModal(false)}>Cerrar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .extra-small { font-size: 0.7rem; }
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .text-success-emphasis { color: #198754; }
                
                .modal-custom-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 99999; /* Super top */
                }

                .modal-custom-card {
                    width: 95%;
                    max-width: 500px;
                    margin: 0 !important;
                    animation: modalSlideUp 0.3s ease-out;
                }

                @keyframes modalSlideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}} />
        </>
    );
}

export default AdminExpensesTable;
