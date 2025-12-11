
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
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

    const [userData, setUserData] = useState({});
    const [editData, setEditData] = useState({});
    const [companyJobs, setCompanyJobs] = useState([]);
    const [candidateApplications, setCandidateApplications] = useState([]);

    useEffect(() => {
        loadProfile();
    }, [id]);

    const loadProfile = async () => {
        setLoading(true);
        try {
            let response;
            if (id) {
                response = await userService.getUserProfile(id);
            } else {
                response = await userService.getProfile();
            }

            const data = response.data || response;

            const commonData = {
                id: data.id,
                rol: data.rol,
                nombre: data.nombre || '',
                email: data.email || '',
                telefono: data.telefono || '',
                fotoPerfil: data.foto_perfil ? api.getFileUrl(data.foto_perfil) : 'https://placehold.co/200x200',
            };

            let roleData = {};

            if (data.rol === 'CANDIDATO' && data.candidato) {
                roleData = {
                    relationId: data.candidato.id,
                    apellidos: data.candidato.apellidos || '',
                    fechaNacimiento: data.candidato.fecha_nacimiento || '',
                    localizacion: data.candidato.ubicacion || '',
                    descripcion: data.candidato.descripcion || '',
                    urlCv: data.candidato.url_cv || '',
                };
            } else if (data.rol === 'EMPRESA' && data.empresa) {
                roleData = {
                    relationId: data.empresa.id,
                    descripcion: data.empresa.descripcion || '',
                    sector: data.empresa.sector || '',
                    tamanoEmpresa: data.empresa.tamano_empresa || '1-10',
                    localizacion: data.empresa.ubicacion || '',
                    web: data.empresa.web || '',
                    impresionesRestantes: data.empresa.impresiones_restantes || 0
                };
            } else if (data.rol === 'EMPLEADO' && data.empleado) {
                roleData = {
                    relationId: data.empleado.id,
                    apellidos: data.empleado.apellidos || '',
                    fechaNacimiento: data.empleado.fecha_nacimiento || '',
                    puesto: data.empleado.puesto || '',
                };
            }

            const finalData = { ...commonData, ...roleData };
            setUserData(finalData);
            setEditData(finalData);

            // Fetch jobs if company
            if (data.rol === 'EMPRESA' && data.empresa) {
               fetchCompanyJobs(data.empresa.id);
            }

            // Fetch applications if candidate and own profile
            if (data.rol === 'CANDIDATO' && isOwnProfile) {
                fetchCandidateApplications();
            }

        } catch (err) {
            console.error(err);
            setError("Error al cargar el perfil.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanyJobs = async (empresaId) => {
        try {
            const data = await jobService.getJobs({ empresa_id: empresaId, page: 1 });
            // Take only first 3
            setCompanyJobs(data.data.slice(0, 3));
        } catch (error) {
            console.error("Error fetching company jobs:", error);
        }
    };

    const fetchCandidateApplications = async () => {
        try {
            const data = await applicationService.getMyApplications();
            // Take only first 3
            setCandidateApplications(data.data.slice(0, 3));
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const handleChange = (field, value) => {
        setEditData({ ...editData, [field]: value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setEditData({ ...editData, cvFile: e.target.files[0] });
        }
    };

    const handleProfilePicChange = (e) => {
         if (e.target.files && e.target.files[0]) {
            setEditData({ ...editData, fotoPerfilFile: e.target.files[0], fotoPerfilPreview: URL.createObjectURL(e.target.files[0]) });
        }
    };

    const handleSave = async () => {
        try {
            // Update User (Common data + Photo)
            if (editData.fotoPerfilFile) {
                 const userFormData = new FormData();
                 userFormData.append('nombre', editData.nombre);
                 if(editData.telefono) userFormData.append('telefono', editData.telefono);
                 userFormData.append('foto_perfil', editData.fotoPerfilFile);
                 userFormData.append('_method', 'PUT');
                 
                 await api.post(`/usuarios/${editData.id}`, userFormData);
            } else {
                 const userPayload = {
                    nombre: editData.nombre,
                    telefono: editData.telefono,
                };
                await userService.updateUser(editData.id, userPayload);
            }

            if (editData.rol === 'CANDIDATO' && editData.relationId) {
                let payload = {};
                if (editData.cvFile) {
                    payload = new FormData();
                    payload.append('apellidos', editData.apellidos);
                    payload.append('fecha_nacimiento', editData.fechaNacimiento);
                    payload.append('ubicacion', editData.localizacion);
                    payload.append('descripcion', editData.descripcion);
                    payload.append('cv_file', editData.cvFile);
                    payload.append('_method', 'PUT');
                } else {
                    payload = {
                        apellidos: editData.apellidos,
                        fecha_nacimiento: editData.fechaNacimiento,
                        ubicacion: editData.localizacion,
                        descripcion: editData.descripcion
                    };
                }

                if (payload instanceof FormData) {
                    await api.post(`/candidatos/${editData.relationId}`, payload);
                } else {
                    await userService.updateCandidato(editData.relationId, payload);
                }

            } else if (editData.rol === 'EMPRESA' && editData.relationId) {
                await userService.updateEmpresa(editData.relationId, {
                    descripcion: editData.descripcion,
                    sector: editData.sector,
                    tamano_empresa: editData.tamanoEmpresa,
                    ubicacion: editData.localizacion,
                    web: editData.web
                });
            } else if (editData.rol === 'EMPLEADO' && editData.relationId) {
                await userService.updateEmpleado(editData.relationId, {
                    apellidos: editData.apellidos,
                    fecha_nacimiento: editData.fechaNacimiento,
                    puesto: editData.puesto
                });
            }

            // Actualizar contexto global si es el perfil propio
            if (isOwnProfile) {
                // Siempre recargamos el perfil completo para obtener la URL de la foto actualizada
                const profileRes = await userService.getProfile();
                updateUser(profileRes.data || profileRes);
            }

            loadProfile();
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Error al guardar los cambios.");
        }
    };

    const handleBuyCredits = async () => {
        const amountStr = window.prompt("¿Cuántos créditos (impresiones) deseas comprar?", "500");
        if (!amountStr) return;

        const amount = parseInt(amountStr);
        if (isNaN(amount) || amount <= 0) {
            alert("Por favor, introduce una cantidad válida.");
            return;
        }

        try {
            const response = await userService.addCredits(userData.relationId, amount);
            // Actualizar el estado local
            setUserData(prev => ({
                ...prev,
                impresionesRestantes: response.impresiones_restantes
            }));
            alert(`¡Compra realizada con éxito! Ahora tienes ${response.impresiones_restantes} créditos.`);
        } catch (error) {
            console.error("Error comprando créditos:", error);
            alert("Error al procesar la compra. Inténtalo de nuevo.");
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({ ...userData });
    };

    const calcularEdad = (fecha) => {
        if (!fecha) return '';
        const hoy = new Date();
        const nacimiento = new Date(fecha);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
        return `${edad} años`;
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );
    if (error) return (
        <div className="container py-5 text-center text-danger">
            <h3 className="h5">{error}</h3>
        </div>
    );

    const isEmpresa = userData.rol === 'EMPRESA';
    const isCandidato = userData.rol === 'CANDIDATO';
    const isEmpleado = userData.rol === 'EMPLEADO';

    return (
        <div className="container py-5">
            {/* Header */}
            <div className="card-premium p-4 mb-4">
                <div className="row align-items-center">
                    <div className="col-auto">
                        <div className="rounded-circle overflow-hidden border border-3 border-light shadow-sm position-relative group-hover-parent" style={{width: '100px', height: '100px'}}>
                            <img src={editData.fotoPerfilPreview || userData.fotoPerfil} alt="Foto" className="w-100 h-100 object-fit-cover" />
                             
                             {/* Overlay de edición */}
                             {isEditing && (
                                <>
                                    <div 
                                        className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center cursor-pointer opacity-hover transition-opacity"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => document.getElementById('profile-pic-input').click()}
                                    >
                                        <span className="material-symbols-outlined text-white">photo_camera</span>
                                    </div>
                                    <input 
                                        type="file" 
                                        id="profile-pic-input" 
                                        className="d-none" 
                                        accept="image/*"
                                        onChange={handleProfilePicChange}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="col">
                        <h1 className="h3 fw-bold mb-1 text-gradient">
                            {userData.nombre} {userData.apellidos || ''}
                        </h1>

                        {/* Subtítulo dinámico */}
                        {isEmpresa && <p className="text-secondary mb-2 fw-medium">{userData.sector}</p>}
                        {isEmpleado && <p className="text-secondary mb-2 fw-medium">{userData.puesto}</p>}

                        <div className="d-flex flex-wrap gap-3 text-muted small">
                            {userData.localizacion && (
                                <span className="d-flex align-items-center gap-1">
                                    <span className="material-symbols-outlined fs-6">location_on</span>
                                    {userData.localizacion}
                                </span>
                            )}
                            
                            {!isEmpresa && userData.fechaNacimiento && (
                                <span className="d-flex align-items-center gap-1">
                                    <span className="material-symbols-outlined fs-6">cake</span>
                                    {calcularEdad(userData.fechaNacimiento)}
                                </span>
                            )}
                            
                            {isEmpresa && userData.web && (
                                <span className="d-flex align-items-center gap-1">
                                    <span className="material-symbols-outlined fs-6">language</span>
                                    <a href={userData.web} target="_blank" rel="noopener noreferrer" className="text-decoration-none">{userData.web}</a>
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="col-auto">
                        {/* Mostrar botón editar SOLO si es el perfil propio */}
                        {isOwnProfile && (
                            !isEditing ? (
                                <button className="btn-premium px-4 d-flex align-items-center gap-2" onClick={() => setIsEditing(true)}>
                                    <span className="material-symbols-outlined fs-5 text-white">edit</span> Editar Perfil
                                </button>
                            ) : (
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={handleCancel}>
                                        <span className="material-symbols-outlined">close</span> Cancelar
                                    </button>
                                    <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSave}>
                                        <span className="material-symbols-outlined">save</span> Guardar
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-12 col-lg-8">

                    {(isCandidato || isEmpresa) && (
                        <div className="card-premium p-4 mb-4">
                            <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined text-primary">description</span>
                                {isEmpresa ? 'Sobre la empresa' : 'Sobre mí'}
                            </h2>
                            {!isEditing ? (
                                <p className="text-muted mb-0" style={{lineHeight: '1.6'}}>{userData.descripcion || 'No has añadido una descripción aún.'}</p>
                            ) : (
                                <textarea className="form-control" rows="4" value={editData.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)} />
                            )}
                        </div>
                    )}

                    {isEmpresa && (
                        <div className="card-premium p-4 mb-4">
                            <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined text-primary">business</span>
                                Detalles de Empresa
                            </h2>
                            <div className="row g-3">
                                {isEditing && (
                                    <div className="col-md-6">
                                        <div className="p-3 bg-light rounded h-100">
                                            <label className="form-label small text-muted text-uppercase fw-bold mb-1">Web</label>
                                            <input type="url" className="form-control" value={editData.web} onChange={(e) => handleChange('web', e.target.value)} />
                                        </div>
                                    </div>
                                )}
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded h-100">
                                        <label className="form-label small text-muted text-uppercase fw-bold mb-1">Sector</label>
                                        {!isEditing ? <p className="mb-0 fw-medium text-dark">{userData.sector}</p>
                                            : <input type="text" className="form-control" value={editData.sector} onChange={(e) => handleChange('sector', e.target.value)} />}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                     <div className="p-3 bg-light rounded h-100">
                                        <label className="form-label small text-muted text-uppercase fw-bold mb-1">Tamaño</label>
                                        {!isEditing ? <p className="mb-0 fw-medium text-dark">{userData.tamanoEmpresa}</p>
                                            : (
                                                <select className="form-select" value={editData.tamanoEmpresa} onChange={(e) => handleChange('tamanoEmpresa', e.target.value)}>
                                                    <option value="1-10">1-10</option>
                                                    <option value="11-50">11-50</option>
                                                    <option value="51-200">51-200</option>
                                                    <option value="201-500">201-500</option>
                                                    <option value="+500">+500</option>
                                                </select>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card-premium p-4">
                        <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                            <span className="material-symbols-outlined text-primary">person</span>
                            Información Personal
                        </h2>
                        <div className="row g-3">

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="small text-muted mb-1 d-block">Email</label>
                                    <p className="mb-0 fw-medium text-dark bg-light p-2 rounded">{userData.email}</p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="small text-muted mb-1 d-block">Nombre</label>
                                    {!isEditing ? <p className="mb-0 fw-medium text-dark bg-light p-2 rounded">{userData.nombre}</p>
                                        : <input type="text" className="form-control" value={editData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} />}
                                </div>
                            </div>

                            {!isEmpresa && (
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="small text-muted mb-1 d-block">Apellidos</label>
                                        {!isEditing ? <p className="mb-0 fw-medium text-dark bg-light p-2 rounded">{userData.apellidos}</p>
                                            : <input type="text" className="form-control" value={editData.apellidos} onChange={(e) => handleChange('apellidos', e.target.value)} />}
                                    </div>
                                </div>
                            )}

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="small text-muted mb-1 d-block">Teléfono</label>
                                    {!isEditing ? <p className="mb-0 fw-medium text-dark bg-light p-2 rounded">{userData.telefono}</p>
                                        : <input type="tel" className="form-control" value={editData.telefono} onChange={(e) => handleChange('telefono', e.target.value)} />}
                                </div>
                            </div>

                            {(isCandidato || isEmpresa) && (
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="small text-muted mb-1 d-block">Localización</label>
                                        {!isEditing ? <p className="mb-0 fw-medium text-dark bg-light p-2 rounded">{userData.localizacion}</p>
                                            : <input type="text" className="form-control" value={editData.localizacion} onChange={(e) => handleChange('localizacion', e.target.value)} />}
                                    </div>
                                </div>
                            )}

                            {isEmpleado && (
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="small text-muted mb-1 d-block">Puesto</label>
                                        {!isEditing ? <p className="mb-0 fw-medium text-dark bg-light p-2 rounded">{userData.puesto}</p>
                                            : <input type="text" className="form-control" value={editData.puesto} onChange={(e) => handleChange('puesto', e.target.value)} />}
                                    </div>
                                </div>
                            )}

                                {!isEmpresa && (
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="small text-muted mb-1 d-block">Curriculum Vitae</label>
                                            {!isEditing ? (
                                                userData.urlCv ? (
                                                    <a href={api.getFileUrl(userData.urlCv)} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1">
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
                                <button className="btn-premium w-100 justify-content-center" onClick={handleBuyCredits}>
                                    Comprar Créditos
                                </button>
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
                                                <p className="text-muted small mb-2 text-truncate" style={{maxWidth: '300px'}}>{job.descripcion}</p>
                                                <div className="d-flex flex-wrap gap-2 small text-secondary">
                                                    <span className="badge bg-white text-secondary border fw-normal">{job.tipo_jornada}</span>
                                                    <span className="d-flex align-items-center gap-1">
                                                        <span className="material-symbols-outlined" style={{fontSize: '14px'}}>location_on</span>
                                                        {job.ubicacion}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        <Link 
                                            to={`/ofertas?empresa_id=${userData.relationId}`} 
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
                                                    <span className={`badge rounded-pill fw-normal shadow-sm ${
                                                        app.estado === 'ACEPTADA' ? 'bg-success-subtle text-success border border-success-subtle' : 
                                                        app.estado === 'RECHAZADA' ? 'bg-danger-subtle text-danger border border-danger-subtle' : 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
                                                    }`}>
                                                        {app.estado}
                                                    </span>
                                                </div>
                                                <div className="d-flex align-items-center gap-1 small text-muted">
                                                    <span className="material-symbols-outlined" style={{fontSize: '14px'}}>calendar_today</span>
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
