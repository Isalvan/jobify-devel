import { useState } from 'react';
import './css/PerfilPage.css';

function PerfilPage() {
    const [isEditing, setIsEditing] = useState(false);
    const propio = true; // TODO: Verificar si es el perfil del usuario actual


    // Datos del usuario
    const [userData, setUserData] = useState({
        nombre: 'Nombre',
        apellidos: 'Apellido1 Apellido2',
        email: 'nombre.apellido@email.com',
        telefono: '+34 123 45 67 89',
        fechaNacimiento: '2000-01-01',
        localizacion: 'Ciudad, País',
        descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        fotoPerfil: 'https://placehold.co/200x200'
    }); // TODO: Reemplazar con datos reales del usuario

    const [editData, setEditData] = useState({ ...userData });

    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({ ...userData });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({ ...userData });
    };

    const handleSave = () => {
        setUserData({ ...editData });
        setIsEditing(false);
    };

    const handleChange = (field, value) => {
        setEditData({ ...editData, [field]: value });
    };

    return (
        <div className="perfil-page">
            <div className="container py-5">
                {/* Header del perfil */}
                <div className="perfil-header bg-white rounded shadow-sm p-4 mb-4">
                    <div className="row align-items-center">
                        <div className="col-auto">
                            <div className="perfil-foto-container">
                                <img
                                    src={userData.fotoPerfil}
                                    alt="Foto de perfil"
                                    className="perfil-foto"
                                />
                            </div>
                        </div>
                        <div className="col">
                            <h1 className="h3 fw-bold mb-1">
                                {userData.nombre} {userData.apellidos}
                            </h1>
                            <p className="text-muted mb-2">
                                <span className="material-symbols-outlined align-middle me-1">location_on</span>
                                {userData.localizacion}
                            </p>
                            <p className="text-muted mb-0">
                                <span className="material-symbols-outlined align-middle me-1">cake</span>
                                {calcularEdad(userData.fechaNacimiento)} años
                            </p>
                        </div>
                        <div className="col-auto">
                            {propio && (
                                !isEditing ? (
                                    <button
                                        className="btn btn-primary d-flex align-items-center gap-2"
                                        onClick={handleEdit}
                                    >
                                        <span className="material-symbols-outlined white-icon">edit</span>
                                        Editar Perfil
                                    </button>
                                ) : (
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-outline-secondary d-flex align-items-center gap-2"
                                            onClick={handleCancel}
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                            Cancelar
                                        </button>
                                        <button
                                            className="btn btn-primary d-flex align-items-center gap-2"
                                            onClick={handleSave}
                                        >
                                            <span className="material-symbols-outlined white-icon">save</span>
                                            Guardar
                                        </button>
                                    </div>
                                )
                            )}

                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Información personal */}
                    <div className="col-12 col-lg-8">
                        <div className="perfil-section bg-white rounded shadow-sm p-4 mb-4">
                            <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined text-primary">person</span>
                                Sobre mí
                            </h2>

                            {!isEditing ? (
                                <p className="text-muted mb-0">{userData.descripcion}</p>
                            ) : (
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={editData.descripcion}
                                    onChange={(e) => handleChange('descripcion', e.target.value)}
                                    placeholder="Cuéntanos algo sobre ti..."
                                />
                            )}
                        </div>

                        <div className="perfil-section bg-white rounded shadow-sm p-4">
                            <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                                Información de contacto
                            </h2>

                            <div className="info-grid">
                                <div className="info-item">
                                    <div className="d-flex align-items-start gap-3">
                                        <span className="material-symbols-outlined text-primary">mail</span>
                                        <div className="flex-grow-1">
                                            <label className="small text-muted mb-1 d-block">Email</label>
                                            {!isEditing ? (
                                                <p className="mb-0 fw-medium">{userData.email}</p>
                                            ) : (
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={editData.email}
                                                    onChange={(e) => handleChange('email', e.target.value)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="d-flex align-items-start gap-3">
                                        <span className="material-symbols-outlined text-primary">phone</span>
                                        <div className="flex-grow-1">
                                            <label className="small text-muted mb-1 d-block">Teléfono</label>
                                            {!isEditing ? (
                                                <p className="mb-0 fw-medium">{userData.telefono}</p>
                                            ) : (
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    value={editData.telefono}
                                                    onChange={(e) => handleChange('telefono', e.target.value)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="d-flex align-items-start gap-3">
                                        <span className="material-symbols-outlined text-primary">place</span>
                                        <div className="flex-grow-1">
                                            <label className="small text-muted mb-1 d-block">Localización</label>
                                            {!isEditing ? (
                                                <p className="mb-0 fw-medium">{userData.localizacion}</p>
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editData.localizacion}
                                                    onChange={(e) => handleChange('localizacion', e.target.value)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="d-flex align-items-start gap-3">
                                        <span className="material-symbols-outlined text-primary">calendar_month</span>
                                        <div className="flex-grow-1">
                                            <label className="small text-muted mb-1 d-block">Fecha de nacimiento</label>
                                            {!isEditing ? (
                                                <p className="mb-0 fw-medium">
                                                    {new Date(userData.fechaNacimiento).toLocaleDateString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            ) : (
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={editData.fechaNacimiento}
                                                    onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-12 col-lg-4">
                        {/* Estadísticas */}
                        <div className="perfil-section bg-white rounded shadow-sm p-4 mb-4">
                            <h2 className="h5 fw-bold mb-4 d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined text-primary">analytics</span>
                                Actividad
                            </h2>

                            <div className="estadisticas">
                                <div className="estadistica-item">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <span className="text-muted">Aplicaciones enviadas</span>
                                        <span className="badge bg-primary-subtle text-primary fw-bold">12</span>
                                    </div>
                                </div>
                                <div className="estadistica-item">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <span className="text-muted">Entrevistas</span>
                                        <span className="badge bg-success-subtle text-success fw-bold">3</span>
                                    </div>
                                </div>
                                <div className="estadistica-item">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span className="text-muted">Perfil visto</span>
                                        <span className="badge bg-info-subtle text-info fw-bold">45</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PerfilPage;
