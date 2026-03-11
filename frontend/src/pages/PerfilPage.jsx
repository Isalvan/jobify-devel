import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import TinyEditor from '../components/common/TinyEditor';
import DOMPurify from 'dompurify';

import { userService } from '../services/userService';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { api } from '../utils/api';
import { AppContext } from '../contexts/AppProvider';

function PerfilPage() {
    const { id } = useParams();
    const { user, updateUser } = useContext(AppContext);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isOwnProfile = !id || (user && user.id === parseInt(id));
    const [userData, setUserData] = useState({
        nombre: '',
        email: '',
        fotoPerfil: '',
        telefono: '',
        rol: '',
        estado: '',
        biografia: '',
        experiencia: '',
        educacion: '',
        habilidades: '',
        ubicacion: '',
        fechaNacimiento: '',
        urlCv: '',
        relationId: null
    });

    const [editData, setEditData] = useState({});
    const [companyJobs, setCompanyJobs] = useState([]);
    const [candidateApplications, setCandidateApplications] = useState([]);

    useEffect(() => {
        fetchUserData();
    }, [id]);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const userId = id || (user && user.id);
            if (!userId) return;

            const response = await userService.getProfile(userId);
            const data = response.data || response;

            const baseData = {
                nombre: data.nombre || '',
                email: data.email || '',
                fotoPerfil: data.foto_perfil || '',
                telefono: data.telefono || '',
                rol: data.rol || '',
                estado: data.estado || '',
            };

            let additionalData = {};
            if (data.candidato) {
                additionalData = {
                    relationId: data.candidato.id,
                    biografia: data.candidato.descripcion || '',
                    experiencia: data.candidato.experiencia || '',
                    educacion: data.candidato.educacion || '',
                    habilidades: data.candidato.habilidades || '',
                    ubicacion: data.candidato.ubicacion || '',
                    fechaNacimiento: data.candidato.fecha_nacimiento || '',
                    urlCv: data.candidato.url_cv || '',
                };
            } else if (data.empresa) {
                additionalData = {
                    relationId: data.empresa.id,
                    nombreEmpresa: data.empresa.nombre || '',
                    biografia: data.empresa.descripcion || '',
                    ubicacion: data.empresa.ubicacion || '',
                    web: data.empresa.sitio_web || '',
                    impresionesRestantes: data.empresa.impresiones_restantes || 0
                };
            }

            const merged = { ...baseData, ...additionalData };
            setUserData(merged);
            setEditData(merged);

            // Fetch relations
            if (data.empresa) {
                const jobs = await jobService.getJobs({ empresa_id: data.empresa.id });
                setCompanyJobs(jobs.data || []);
            } else if (data.candidato && isOwnProfile) {
                const apps = await applicationService.getApplications();
                setCandidateApplications(apps.data || apps);
            }

        } catch (err) {
            console.error('Error al cargar perfil:', err);
            setError('No se pudo cargar la información del perfil.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setEditData(userData);
        }
        setIsEditing(!isEditing);
    };

    const handleChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditData(prev => ({ ...prev, cvFile: file }));
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('nombre', editData.nombre);
            formData.append('email', editData.email);
            formData.append('telefono', editData.telefono);

            if (userData.rol === 'CANDIDATO') {
                formData.append('descripcion', editData.biografia);
                formData.append('experiencia', editData.experiencia);
                formData.append('educacion', editData.educacion);
                formData.append('habilidades', editData.habilidades);
                formData.append('ubicacion', editData.ubicacion);
                formData.append('fecha_nacimiento', editData.fechaNacimiento);
                if (editData.cvFile) {
                    formData.append('url_cv', editData.cvFile);
                }
            } else if (userData.rol === 'EMPRESA') {
                formData.append('nombre_empresa', editData.nombreEmpresa);
                formData.append('descripcion', editData.biografia);
                formData.append('ubicacion', editData.ubicacion);
                formData.append('sitio_web', editData.web);
            }

            const response = await userService.updateProfile(user.id, formData);
            setUserData(editData);
            if (isOwnProfile) {
                updateUser(response.data || response);
            }
            setIsEditing(false);
            fetchUserData(); // Refresh to get server-side paths etc
        } catch (err) {
            console.error('Error al guardar perfil:', err);
            alert('Error al guardar los cambios.');
        }
    };

    const handleBuyCredits = () => {
        // Mock functionality
        alert('Redirigiendo a pasarela de pago...');
    };

    if (loading) return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="container py-5">
            <div className="alert alert-danger">{error}</div>
        </div>
    );

    const isEmpresa = userData.rol === 'EMPRESA';
    const isCandidato = userData.rol === 'CANDIDATO';

    return (
        <div className="container py-4 py-lg-5">
            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    {/* Main Info Card */}
                    <div className="card-premium p-0 overflow-hidden mb-4">
                        <div className="bg-gradient-primary-soft p-4 p-lg-5 text-center border-bottom position-relative">
                            {isOwnProfile && (
                                <button
                                    onClick={isEditing ? handleSave : handleEditToggle}
                                    className="btn btn-sm btn-light shadow-sm position-absolute top-0 end-0 m-3 d-flex align-items-center gap-1 z-1"
                                >
                                    <span className="material-symbols-outlined fs-6">{isEditing ? 'save' : 'edit'}</span>
                                    {isEditing ? 'Guardar' : 'Editar'}
                                </button>
                            )}

                            <div className="position-relative d-inline-block mb-3">
                                <img
                                    src={userData.fotoPerfil}
                                    alt={userData.nombre}
                                    className="rounded-circle shadow-lg border border-4 border-white"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                />
                                {isEditing && (
                                    <button className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 p-1 shadow">
                                        <span className="material-symbols-outlined fs-6">camera_alt</span>
                                    </button>
                                )}
                            </div>

                            {!isEditing ? (
                                <>
                                    <h1 className="h3 fw-bold mb-1 text-dark">
                                        {isEmpresa ? userData.nombreEmpresa : userData.nombre}
                                    </h1>
                                    <p className="text-muted d-flex align-items-center justify-content-center gap-2 mb-0">
                                        <span className="material-symbols-outlined fs-6">location_on</span>
                                        {userData.ubicacion || 'Ubicación no especificada'}
                                        {isEmpresa && userData.web && (
                                            <>
                                                <span className="mx-1">•</span>
                                                <span className="material-symbols-outlined fs-6">language</span>
                                                <a href={userData.web} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary">Web</a>
                                            </>
                                        )}
                                    </p>
                                </>
                            ) : (
                                <div className="max-w-md mx-auto">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg text-center mb-2"
                                        value={isEmpresa ? editData.nombreEmpresa : editData.nombre}
                                        onChange={(e) => handleChange(isEmpresa ? 'nombreEmpresa' : 'nombre', e.target.value)}
                                        placeholder="Tu nombre"
                                    />
                                    <input
                                        type="text"
                                        className="form-control text-center"
                                        value={editData.ubicacion}
                                        onChange={(e) => handleChange('ubicacion', e.target.value)}
                                        placeholder="Ciudad, País"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="p-4 p-lg-5">
                            <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined text-primary">person</span>
                                {isEmpresa ? 'Sobre la empresa' : 'Biografía'}
                            </h2>
                            {!isEditing ? (
                                <p className="text-muted mb-0 lh-lg" style={{ whiteSpace: 'pre-line' }}>
                                    {userData.biografia || 'Sin descripción disponible.'}
                                </p>
                            ) : (
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={editData.biografia}
                                    onChange={(e) => handleChange('biografia', e.target.value)}
                                    placeholder="Cuéntanos un poco sobre ti..."
                                ></textarea>
                            )}
                        </div>
                    </div>

                    {/* Additional Details for Candidate */}
                    {isCandidato && (
                        <div className="d-flex flex-column gap-4 mb-4">
                            <div className="card-premium p-4 p-lg-5">
                                <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">work_history</span>
                                    Experiencia Profesional
                                </h2>
                                {!isEditing ? (
                                    <div className="text-muted" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userData.experiencia) }} />
                                ) : (
                                    <TinyEditor
                                        value={editData.experiencia}
                                        onChange={(content) => handleChange('experiencia', content)}
                                    />
                                )}
                            </div>

                            <div className="card-premium p-4 p-lg-5">
                                <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">school</span>
                                    Educación y Formación
                                </h2>
                                {!isEditing ? (
                                    <div className="text-muted" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userData.educacion) }} />
                                ) : (
                                    <TinyEditor
                                        value={editData.educacion}
                                        onChange={(content) => handleChange('educacion', content)}
                                    />
                                )}
                            </div>

                            <div className="card-premium p-4 p-lg-5">
                                <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">psychology</span>
                                    Habilidades
                                </h2>
                                {!isEditing ? (
                                    <div className="text-muted" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userData.habilidades) }} />
                                ) : (
                                    <TinyEditor
                                        value={editData.habilidades}
                                        onChange={(content) => handleChange('habilidades', content)}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Contact Info Card */}
                    <div className="card-premium p-4 p-lg-5">
                        <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                            <span className="material-symbols-outlined text-primary">contact_page</span>
                            Información de Contacto
                        </h2>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="small text-muted mb-1 d-block">Email</label>
                                    {!isEditing ? (
                                        <p className="mb-0 fw-medium text-dark bg-light p-2 rounded">{userData.email}</p>
                                    ) : (
                                        <input type="email" className="form-control" value={editData.email} onChange={(e) => handleChange('email', e.target.value)} />
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="small text-muted mb-1 d-block">Teléfono</label>
                                    {!isEditing ? (
                                        <p className="mb-0 fw-medium text-dark bg-light p-2 rounded">{userData.telefono || '-'}</p>
                                    ) : (
                                        <input type="tel" className="form-control" value={editData.telefono} onChange={(e) => handleChange('telefono', e.target.value)} />
                                    )}
                                </div>
                            </div>

                            {isCandidato && (
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="small text-muted mb-1 d-block">Curriculum Vitae</label>
                                        {!isEditing ? (
                                            userData.urlCv ? (
                                                <a href={`${import.meta.env.VITE_API_URL || 'http://localhost/api'}/storage/${userData.urlCv}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1">
                                                    <span className="material-symbols-outlined fs-6">download</span> Ver CV actual
                                                </a>
                                            ) : <span className="text-muted small">No hay CV subido</span>
                                        ) : (
                                            <input
                                                type="file"
                                                className="form-control form-control-sm"
                                                onChange={handleFileChange}
                                                accept=".pdf"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}

                            {!isEmpresa && (
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="small text-muted mb-1 d-block">Fecha de nacimiento</label>
                                        {!isEditing ? (
                                            <p className="mb-0 fw-medium text-dark bg-light p-2 rounded">
                                                {userData.fechaNacimiento ? new Date(userData.fechaNacimiento).toLocaleDateString() : '-'}
                                            </p>
                                        ) : (
                                            <input type="date" className="form-control" value={editData.fechaNacimiento} onChange={(e) => handleChange('fechaNacimiento', e.target.value)} />
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-4">
                    <div className="card-premium p-4 mb-4">
                        <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                            <span className="material-symbols-outlined text-primary">analytics</span>
                            Actividad
                        </h2>

                        {isEmpresa && isOwnProfile && (
                            <div className="bg-light p-3 rounded mb-4 border hover-shadow transition-all text-center">
                                <h6 className="fw-bold text-dark text-uppercase small mb-2">Créditos Disponibles</h6>
                                <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-warning fs-3">monetization_on</span>
                                    <span className="display-6 fw-bold text-dark lh-1">{userData.impresionesRestantes}</span>
                                </div>
                                <p className="small text-muted mb-3">Las impresiones permiten que tus ofertas sean vistas como destacadas.</p>
                                <button className="btn-premium w-100 justify-content-center mb-2" onClick={handleBuyCredits}>
                                    Comprar Créditos
                                </button>
                                <Link to="/facturacion" className="btn btn-outline-secondary w-100 justify-content-center d-flex align-items-center gap-2">
                                    <span className="material-symbols-outlined fs-6">receipt_long</span>
                                    Ver Facturación
                                </Link>
                            </div>
                        )}

                        {isEmpresa ? (
                            <>
                                {companyJobs.length > 0 ? (
                                    <div className="d-flex flex-column gap-3">
                                        {companyJobs.map(job => (
                                            <div key={job.id} className="p-3 bg-light rounded hover-shadow transition-all border border-transparent hover-border-primary position-relative">
                                                <Link to={`/ofertas/${job.id}`} className="text-decoration-none text-dark d-block stretched-link">
                                                    <h6 className="fw-bold mb-1 text-primary-hover transition-colors">{job.titulo}</h6>
                                                </Link>
                                                <p className="text-muted small mb-2 text-truncate" style={{ maxWidth: '300px' }}>{job.descripcion}</p>
                                                <div className="d-flex flex-wrap gap-2 small text-secondary">
                                                    <span className="badge bg-white text-secondary border fw-normal">{job.tipo_jornada}</span>
                                                    <span className="d-flex align-items-center gap-1">
                                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
                                                        {job.ubicacion}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        <Link
                                            to={`/ofertas-empresa/${userData.relationId}`}
                                            className="btn-premium-outline w-100 justify-content-center mt-3"
                                        >
                                            Ver más ofertas de esta empresa
                                        </Link>
                                    </div>
                                ) : (
                                    <p className="text-muted text-center py-3">Esta empresa no ha publicado ofertas recientes.</p>
                                )}
                            </>
                        ) : isCandidato && isOwnProfile ? (
                            <>
                                {candidateApplications.length > 0 ? (
                                    <div className="d-flex flex-column gap-3">
                                        {candidateApplications.map(app => (
                                            <div key={app.id} className="p-3 bg-light rounded hover-shadow transition-all border border-transparent hover-border-primary position-relative">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <Link to={`/ofertas/${app.trabajo.id}`} className="text-decoration-none text-dark d-block stretched-link">
                                                            <h6 className="fw-bold mb-0 text-primary-hover transition-colors">{app.trabajo.titulo}</h6>
                                                        </Link>
                                                        <p className="text-muted small mb-0">{app.trabajo.empresa?.nombre}</p>
                                                    </div>
                                                    <span className={`badge rounded-pill fw-normal shadow-sm ${app.estado === 'ACEPTADA' ? 'bg-success-subtle text-success border border-success-subtle' :
                                                        app.estado === 'RECHAZADA' ? 'bg-danger-subtle text-danger border border-danger-subtle' : 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
                                                        }`}>
                                                        {app.estado}
                                                    </span>
                                                </div>
                                                <div className="d-flex align-items-center gap-1 small text-muted">
                                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
                                                    <span>Aplicado el {new Date(app.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                        <Link
                                            to="/mis-aplicaciones"
                                            className="btn-premium-outline w-100 justify-content-center mt-3"
                                        >
                                            Ver todas mis aplicaciones
                                        </Link>
                                    </div>
                                ) : (
                                    <p className="text-muted text-center py-3">No has aplicado a ninguna oferta aún.</p>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-4 text-muted">
                                <span className="material-symbols-outlined fs-1 mb-2 opacity-50">bar_chart</span>
                                <p className="mb-0 small">Tus estadísticas aparecerán aquí pronto.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PerfilPage;
