import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

function MisEmpleadosPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        puesto: ''
    });

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        setLoading(true);
        try {
            const response = await userService.getEmpleados();
            setEmployees(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.createEmpleado(formData);
            setShowModal(false);
            setFormData({ nombre: '', apellidos: '', email: '', password: '', puesto: '' }); // Reset
            loadEmployees();
        } catch (error) {
            console.error(error);
            alert('Error al registrar empleado (verifica que el email sea único).');
        }
    };

    return (
        <div className="mis-empleados-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 fw-bold m-0">Gestionar Empleados</h2>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
                    <span className="material-symbols-outlined white-icon">person_add</span>
                    Registrar Empleado
                </button>
            </div>

            {loading ? <p>Cargando...</p> : (
                <div className="table-responsive bg-white rounded shadow-sm">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Puesto</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id}>
                                    <td className="fw-medium">
                                        {/* Assuming API returns joined fields or standard structure */}
                                        {emp.usuario?.nombre} {emp.apellidos}
                                    </td>
                                    <td>{emp.usuario?.email}</td>
                                    <td>{emp.puesto}</td>
                                    <td className="text-end">
                                        <button className="btn btn-sm btn-outline-danger" title="Eliminar (No implementado en front)">
                                            <span className="material-symbols-outlined font-sm">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-muted">
                                        No hay otros empleados registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Simple Inline */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nuevo Empleado</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Apellidos</label>
                                        <input type="text" className="form-control" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Contraseña</label>
                                        <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required minLength="8" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Puesto</label>
                                        <input type="text" className="form-control" name="puesto" value={formData.puesto} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary">Registrar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MisEmpleadosPage;
