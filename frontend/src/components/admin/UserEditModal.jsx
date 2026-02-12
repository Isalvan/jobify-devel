import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { companyService } from '../../services/companyService';

function UserEditModal({ show, onHide, user, onUpdate }) {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        rol: '',
        estado: 'ACTIVO',
        // Company specific
        sector: '',
        tamano_empresa: '',
        web: '',
        descripcion: '',
        ubicacion: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                nombre: user.nombre || '',
                email: user.email || '',
                rol: user.rol || '',
                estado: user.estado || 'ACTIVO',
                sector: user.empresa?.sector || '',
                tamano_empresa: user.empresa?.tamano_empresa || '',
                web: user.empresa?.web || '',
                descripcion: user.empresa?.descripcion || '',
                ubicacion: user.empresa?.ubicacion || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Update User generic data
            const userPayload = {
                nombre: formData.nombre,
                email: formData.email,
                rol: formData.rol,
                estado: formData.estado
            };

            // Allow partial updates if backend supports it, sending all for now basic fields
            const updatedUser = await userService.updateUser(user.id, userPayload);

            // If it's a company, update company details
            if (user.rol === 'EMPRESA' && user.empresa) {
                const companyPayload = {
                    sector: formData.sector,
                    tamano_empresa: formData.tamano_empresa,
                    web: formData.web,
                    descripcion: formData.descripcion,
                    ubicacion: formData.ubicacion
                };
                await companyService.updateCompany(user.empresa.id, companyPayload);
            }

            onUpdate && onUpdate();
            onHide();
        } catch (err) {
            console.error(err);
            setError('Error al actualizar el usuario. Verifique los datos.');
        } finally {
            setLoading(false);
        }
    };

    if (!show || !user) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar Usuario: {user.nombre}</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            className="form-control"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Rol</label>
                                        <select
                                            className="form-select"
                                            name="rol"
                                            value={formData.rol}
                                            onChange={handleChange}
                                        >
                                            <option value="CANDIDATO">Candidato</option>
                                            <option value="EMPRESA">Empresa</option>
                                            <option value="ADMIN">Admin</option>
                                            <option value="EMPLEADO">Empleado</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Estado</label>
                                        <select
                                            className="form-select"
                                            name="estado"
                                            value={formData.estado}
                                            onChange={handleChange}
                                        >
                                            <option value="ACTIVO">Activo</option>
                                            <option value="INACTIVO">Inactivo</option>
                                            <option value="BLOQUEADO">Bloqueado</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {user.rol === 'EMPRESA' && (
                                <>
                                    <hr />
                                    <h6 className="mb-3 text-muted">Datos de Empresa</h6>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Sector</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="sector"
                                                    value={formData.sector}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Tamaño</label>
                                                <select
                                                    className="form-select"
                                                    name="tamano_empresa"
                                                    value={formData.tamano_empresa}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    <option value="Pequeña">Pequeña</option>
                                                    <option value="Mediana">Mediana</option>
                                                    <option value="Grande">Grande</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Sitio Web</label>
                                                <input
                                                    className="form-control"
                                                    type="url"
                                                    name="web"
                                                    value={formData.web}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Ubicación</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="ubicacion"
                                                    value={formData.ubicacion}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label">Descripción</label>
                                                <textarea
                                                    className="form-control"
                                                    rows={3}
                                                    name="descripcion"
                                                    value={formData.descripcion}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button type="button" className="btn btn-secondary" onClick={onHide}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserEditModal;
