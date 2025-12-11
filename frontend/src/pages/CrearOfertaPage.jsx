
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobService } from '../services/jobService';

function CrearOfertaPage() {
    const navigate = useNavigate();
    const { id } = useParams(); // For edit mode
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        tipo_trabajo: 'Tiempo Completo',
        modalidad: 'PRESENCIAL',
        salario: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditing) {
            loadJobData();
        }
    }, [id]);

    const loadJobData = async () => {
        setFetching(true);
        try {
            const response = await jobService.getJob(id);
            const job = response.data || response;
            setFormData({
                titulo: job.titulo,
                descripcion: job.descripcion,
                ubicacion: job.ubicacion,
                tipo_trabajo: job.tipo_trabajo,
                modalidad: job.modalidad,
                salario: job.salario || ''
            });
        } catch (err) {
            console.error(err);
            setError("Error al cargar los datos de la oferta.");
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                salario: formData.salario ? parseFloat(formData.salario) : null
            };
            
            if (isEditing) {
                await jobService.updateJob(id, payload);
                navigate(`/ofertas/${id}`);
            } else {
                const response = await jobService.createJob(payload);
                navigate(`/ofertas/${response.data.id}`);
            }
        } catch (err) {
            console.error(err);
            setError("Error al guardar la oferta. Por favor, verifica los datos.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
             <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card-premium p-4 p-md-5">
                        <div className="text-center mb-4">
                            <h1 className="h3 fw-bold text-gradient">{isEditing ? 'Editar oferta' : 'Publicar nueva oferta'}</h1>
                            <p className="text-muted">{isEditing ? 'Actualiza los detalles de tu oferta.' : 'Completa los detalles para encontrar al candidato ideal.'}</p>
                        </div>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-bold small text-uppercase text-muted">Título del puesto</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg bg-light border-0" 
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    placeholder="Ej. Desarrollador Senior Laravel"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold small text-uppercase text-muted">Ubicación</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><span className="material-symbols-outlined text-muted">location_on</span></span>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-lg bg-light border-0" 
                                        name="ubicacion"
                                        value={formData.ubicacion}
                                        onChange={handleChange}
                                        placeholder="Ej. Madrid, Barcelona, Remoto..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Tipo de jornada</label>
                                    <select 
                                        className="form-select form-select-lg bg-light border-0" 
                                        name="tipo_trabajo"
                                        value={formData.tipo_trabajo}
                                        onChange={handleChange}
                                    >
                                        <option value="Tiempo Completo">Tiempo Completo</option>
                                        <option value="Medio Tiempo">Medio Tiempo</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Temporal">Temporal</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Modalidad</label>
                                    <select 
                                        className="form-select form-select-lg bg-light border-0" 
                                        name="modalidad"
                                        value={formData.modalidad}
                                        onChange={handleChange}
                                    >
                                        <option value="PRESENCIAL">Presencial</option>
                                        <option value="REMOTO">Remoto</option>
                                        <option value="HIBRIDO">Híbrido</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold small text-uppercase text-muted">Salario (€) <span className="fw-light text-lowercase">(opcional)</span></label>
                                <input 
                                    type="number" 
                                    className="form-control form-control-lg bg-light border-0" 
                                    name="salario"
                                    value={formData.salario}
                                    onChange={handleChange}
                                    placeholder="Ej. 35000"
                                    min="0"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold small text-uppercase text-muted">Descripción</label>
                                <textarea 
                                    className="form-control bg-light border-0" 
                                    name="descripcion"
                                    rows="6"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Describe las responsabilidades, requisitos y beneficios..."
                                    required
                                ></textarea>
                            </div>

                            <div className="d-grid">
                                <button type="submit" className="btn btn-premium btn-lg" disabled={loading}>
                                    {loading ? (
                                        <span className="d-flex align-items-center justify-content-center gap-2">
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            {isEditing ? 'Guardando...' : 'Publicando...'}
                                        </span>
                                    ) : (isEditing ? 'Guardar Cambios' : 'Publicar Oferta')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CrearOfertaPage;
