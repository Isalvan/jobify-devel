import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/userService';
import { api } from '../utils/api';
import { AppContext } from '../contexts/AppProvider';
import './css/PerfilPage.css';

function PerfilPage() {
    const { id } = useParams(); // Obtener ID de URL si existe (perfil público)
    const { user } = useContext(AppContext);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Determines if viewing own profile
    const isOwnProfile = !id || (user && user.id === parseInt(id));

    // Estado plano unificado.
    // Campos comunes: id, role, nombre, email, telefono, fotoPerfil
    // Campos Candidato/Empleado: apellidos, fechaNacimiento, descripcion (candidato), ubicacion
    // Campos Empresa: descripcion, sector, tamanoEmpresa, web, ubicacion
    // Campos Empleado: puesto
    const [userData, setUserData] = useState({});
    const [editData, setEditData] = useState({});

    // Mapeo inicial
    useEffect(() => {
        loadProfile();
    }, [id]); // Reload if ID changes

    const loadProfile = async () => {
        setLoading(true);
        try {
            let response;
            if (id) {
                response = await userService.getUserProfile(id);
            } else {
                response = await userService.getProfile();
            }

            // Normalizar respuesta: si viene en { data: ... } (Resource) o directo
            const data = response.data || response;

            // data es el objeto Usuario con relaciones cargadas: candidato, empresa, empleado

            const commonData = {
                id: data.id,
                rol: data.rol,
                nombre: data.nombre || '',
                email: data.email || '',
                telefono: data.telefono || '',
                fotoPerfil: data.foto_perfil || 'https://placehold.co/200x200',
            };

            let roleData = {};

            if (data.rol === 'CANDIDATO' && data.candidato) {
                roleData = {
                    relationId: data.candidato.id,
                    apellidos: data.candidato.apellidos || '',
                    fechaNacimiento: data.candidato.fecha_nacimiento || '',
                    localizacion: data.candidato.ubicacion || '',
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
                    web: data.empresa.web || ''
                };
            } else if (data.rol === 'EMPLEADO' && data.empleado) {
                roleData = {
                    relationId: data.empleado.id,
                    apellidos: data.empleado.apellidos || '',
                    fechaNacimiento: data.empleado.fecha_nacimiento || '',
                    puesto: data.empleado.puesto || '',
                    // El empleado no suele tener ubicación propia en este modelo, usa la de empresa?
                    // Asumimos que no edita ubicación
                };
            }

            const finalData = { ...commonData, ...roleData };
            setUserData(finalData);
            setEditData(finalData);

        } catch (err) {
            console.error(err);
            setError("Error al cargar el perfil.");
        } finally {
            setLoading(false);
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

    const handleSave = async () => {
        try {
            // 1. Actualizar Usuario
            const userPayload = {
                nombre: editData.nombre,
                telefono: editData.telefono,
            };
            await userService.updateUser(editData.id, userPayload);

            // 2. Actualizar Entidad Específica
            if (editData.rol === 'CANDIDATO' && editData.relationId) {
                let payload = {};
                if (editData.cvFile) {
                    payload = new FormData();
                    payload.append('apellidos', editData.apellidos);
                    payload.append('fecha_nacimiento', editData.fechaNacimiento);
                    payload.append('ubicacion', editData.localizacion);
                    payload.append('descripcion', editData.descripcion);
                    payload.append('cv_file', editData.cvFile);
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

            // Refresh profile
            loadProfile(); // Reload to get new CV URL
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Error al guardar los cambios.");
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

    if (loading) return <div className="p-5 text-center">Cargando perfil...</div>;
    if (error) return <div className="p-5 text-center text-danger">{error}</div>;

    const isEmpresa = userData.rol === 'EMPRESA';
    const isCandidato = userData.rol === 'CANDIDATO';
    const isEmpleado = userData.rol === 'EMPLEADO';

    return (
        <div className="perfil-page">
            <div className="container py-5">
                {/* Header */}
                <div className="perfil-header bg-white rounded shadow-sm p-4 mb-4">
                    <div className="row align-items-center">
                        <div className="col-auto">
                            <div className="perfil-foto-container">
                                <img src={userData.fotoPerfil} alt="Foto" className="perfil-foto" />
                            </div>
                        </div>
                        <div className="col">
                            <h1 className="h3 fw-bold mb-1">
                                {userData.nombre} {userData.apellidos ? userData.apellidos : ''}
                            </h1>

                            {/* Subtítulo dinámico */}
                            {isEmpresa && <p className="text-muted mb-2">{userData.sector}</p>}
                            {isEmpleado && <p className="text-muted mb-2">{userData.puesto}</p>}

                            <p className="text-muted mb-2">
                                <span className="material-symbols-outlined align-middle me-1">location_on</span>
                                {userData.localizacion || 'Sin ubicación'}
                            </p>

                            {/* Edad solo para personas */}
                            {!isEmpresa && (
                                <p className="text-muted mb-0">
                                    <span className="material-symbols-outlined align-middle me-1">cake</span>
                                    {calcularEdad(userData.fechaNacimiento)}
                                </p>
                            )}

                            {/* Web solo empresa */}
                            {isEmpresa && userData.web && (
                                <p className="text-muted mb-0 mt-2">
                                    <span className="material-symbols-outlined align-middle me-1">language</span>
                                    <a href={userData.web} target="_blank" rel="noopener noreferrer">{userData.web}</a>
                                </p>
                            )}
                        </div>
                        <div className="col-auto">
                            {/* Mostrar botón editar SOLO si es el perfil propio */}
                            {isOwnProfile && (
                                !isEditing ? (
                                    <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setIsEditing(true)}>
                                        <span className="material-symbols-outlined white-icon">edit</span> Editar Perfil
                                    </button>
                                ) : (
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={handleCancel}>
                                            <span className="material-symbols-outlined">close</span> Cancelar
                                        </button>
                                        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSave}>
                                            <span className="material-symbols-outlined white-icon">save</span> Guardar
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-12 col-lg-8">

                        {/* 1. SECCIÓN DESCRIPCIÓN (Candidato/Empresa) */}
                        {(isCandidato || isEmpresa) && (
                            <div className="perfil-section bg-white rounded shadow-sm p-4 mb-4">
                                <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">description</span>
                                    {isEmpresa ? 'Sobre la empresa' : 'Sobre mí'}
                                </h2>
                                {!isEditing ? (
                                    <p className="text-muted mb-0">{userData.descripcion}</p>
                                ) : (
                                    <textarea className="form-control" rows="4" value={editData.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)} />
                                )}
                            </div>
                        )}

                        {/* 2. DATOS ESPECÍFICOS EMPRESA */}
                        {isEmpresa && (
                            <div className="perfil-section bg-white rounded shadow-sm p-4 mb-4">
                                <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">business</span>
                                    Detalles de Empresa
                                </h2>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small text-muted">Web</label>
                                        {!isEditing ? <p>{userData.web || '-'}</p>
                                            : <input type="url" className="form-control" value={editData.web} onChange={(e) => handleChange('web', e.target.value)} />}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small text-muted">Sector</label>
                                        {!isEditing ? <p>{userData.sector}</p>
                                            : <input type="text" className="form-control" value={editData.sector} onChange={(e) => handleChange('sector', e.target.value)} />}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small text-muted">Tamaño</label>
                                        {!isEditing ? <p>{userData.tamanoEmpresa}</p>
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
                        )}


                        {/* 3. INFORMACIÓN DE CONTACTO / BÁSICA (Todos) */}
                        <div className="perfil-section bg-white rounded shadow-sm p-4">
                            <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                                Información Personal
                            </h2>
                            <div className="info-grid">

                                {/* EMAIL (Solo lectura) */}
                                <div className="info-item">
                                    <label className="small text-muted mb-1 d-block">Email</label>
                                    <p className="mb-0 fw-medium">{userData.email}</p>
                                </div>

                                {/* NOMBRE (Usuario) */}
                                <div className="info-item">
                                    <label className="small text-muted mb-1 d-block">Nombre</label>
                                    {!isEditing ? <p className="mb-0 fw-medium">{userData.nombre}</p>
                                        : <input type="text" className="form-control" value={editData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} />}
                                </div>

                                {/* APELLIDOS (Candidato/Empleado) */}
                                {!isEmpresa && (
                                    <div className="info-item">
                                        <label className="small text-muted mb-1 d-block">Apellidos</label>
                                        {!isEditing ? <p className="mb-0 fw-medium">{userData.apellidos}</p>
                                            : <input type="text" className="form-control" value={editData.apellidos} onChange={(e) => handleChange('apellidos', e.target.value)} />}
                                    </div>
                                )}

                                {/* TELEFONO (Usuario) */}
                                <div className="info-item">
                                    <label className="small text-muted mb-1 d-block">Teléfono</label>
                                    {!isEditing ? <p className="mb-0 fw-medium">{userData.telefono}</p>
                                        : <input type="tel" className="form-control" value={editData.telefono} onChange={(e) => handleChange('telefono', e.target.value)} />}
                                </div>

                                {/* LOCALIZACION (Candidato/Empresa) */}
                                {(isCandidato || isEmpresa) && (
                                    <div className="info-item">
                                        <label className="small text-muted mb-1 d-block">Localización</label>
                                        {!isEditing ? <p className="mb-0 fw-medium">{userData.localizacion}</p>
                                            : <input type="text" className="form-control" value={editData.localizacion} onChange={(e) => handleChange('localizacion', e.target.value)} />}
                                    </div>
                                )}

                                {/* PUESTO (Empleado) */}
                                {isEmpleado && (
                                    <div className="info-item">
                                        <label className="small text-muted mb-1 d-block">Puesto</label>
                                        {!isEditing ? <p className="mb-0 fw-medium">{userData.puesto}</p>
                                            : <input type="text" className="form-control" value={editData.puesto} onChange={(e) => handleChange('puesto', e.target.value)} />}
                                    </div>
                                )}

                                {/* FECHA NACIMIENTO (Candidato/Empleado) */}
                                {!isEmpresa && (
                                    <div className="info-item">
                                        <label className="small text-muted mb-1 d-block">Fecha de nacimiento</label>
                                        {!isEditing ? (
                                            <p className="mb-0 fw-medium">
                                                {userData.fechaNacimiento ? new Date(userData.fechaNacimiento).toLocaleDateString() : '-'}
                                            </p>
                                        ) : (
                                            <input type="date" className="form-control" value={editData.fechaNacimiento} onChange={(e) => handleChange('fechaNacimiento', e.target.value)} />
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR (Estadísticas placeholder) */}
                    <div className="col-12 col-lg-4">
                        <div className="perfil-section bg-white rounded shadow-sm p-4 mb-4">
                            <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined text-primary">analytics</span>
                                Actividad
                            </h2>
                            <p className="text-muted">Próximamente verás aquí tus estadísticas.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PerfilPage;
