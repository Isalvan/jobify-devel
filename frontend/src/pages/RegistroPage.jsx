import React, { useState } from 'react';
import './css/RegistroPage.css';

function RegistroPage() {
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [telefono, setTelefono] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [localizacion, setLocalizacion] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async function (e) {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            // Simular llamada a API
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setSuccess('Cuenta creada correctamente.');
            // Opcional: limpiar formulario
            setNombre('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setTelefono('');
            setApellidos('');
            setFechaNacimiento('');
            setDescripcion('');
            setLocalizacion('');
        } catch (err) {
            setError(err.message || 'Error al crear la cuenta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registro-page d-flex align-items-center justify-content-center">
            <div className="registro-container">
                <a href="/" className="volver btn btn-link top-0 start-0 m-3 text-decoration-none">
                    <span className="material-symbols-outlined text-primary">arrow_back</span> Volver al inicio
                </a>

                <div className="texto-bienvenida text-center mb-5">
                    <h1 className="display-5 fw-bold mb-2">Jobify</h1>
                    <p className="lead text-muted">Regístrate y crea tu perfil en Jobify</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row gx-3">
                        <div className="col-12 col-md-6">
                            {/* Nombre */}
                            <div className="mb-4">
                                <label htmlFor="nombre" className="form-label fw-medium">Nombre <span className="text-danger ms-1" aria-hidden="true">*</span></label>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text material-symbols-outlined bg-light">person</span>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        className="form-control form-control-lg"
                                        placeholder="Tu nombre"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            {/* Apellidos */}
                            <div className="mb-4">
                                <label htmlFor="apellidos" className="form-label fw-medium">Apellidos <span className="text-danger ms-1" aria-hidden="true">*</span></label>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text material-symbols-outlined bg-light">badge</span>
                                    <input
                                        type="text"
                                        id="apellidos"
                                        name="apellidos"
                                        className="form-control form-control-lg"
                                        placeholder="Tus apellidos"
                                        value={apellidos}
                                        onChange={(e) => setApellidos(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            {/* Email */}
                            <div className="mb-4">
                                <label htmlFor="email" className="form-label fw-medium">Correo Electrónico <span className="text-danger ms-1" aria-hidden="true">*</span></label>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text material-symbols-outlined bg-light">mail</span>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-control form-control-lg"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            {/* Fecha de nacimiento */}
                            <div className="mb-4">
                                <label htmlFor="fechaNacimiento" className="form-label fw-medium">Fecha de Nacimiento <span className="text-danger ms-1" aria-hidden="true">*</span></label>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text material-symbols-outlined bg-light">calendar_month</span>
                                    <input
                                        type="date"
                                        id="fechaNacimiento"
                                        name="fechaNacimiento"
                                        className="form-control form-control-lg"
                                        value={fechaNacimiento}
                                        onChange={(e) => setFechaNacimiento(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            {/* Contraseña */}
                            <div className="mb-4">
                                <label htmlFor="password" className="form-label fw-medium">Contraseña <span className="text-danger ms-1" aria-hidden="true">*</span></label>
                                <div className="input-group input-group-lg position-relative">
                                    <span className="input-group-text material-symbols-outlined bg-light">lock</span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        className="form-control form-control-lg"
                                        placeholder="Tu contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-pressed={showPassword}
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        <span className="material-symbols-outlined">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            {/* Repetir contraseña */}
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="form-label fw-medium">Repetir Contraseña <span className="text-danger ms-1" aria-hidden="true">*</span></label>
                                <div className="input-group input-group-lg position-relative">
                                    <span className="input-group-text material-symbols-outlined bg-light">lock</span>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="form-control form-control-lg"
                                        placeholder="Repite tu contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-pressed={showConfirmPassword}
                                        aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        <span className="material-symbols-outlined">
                                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            {/* Telefono */}
                            <div className="mb-4">
                                <label htmlFor="telefono" className="form-label fw-medium">Teléfono</label>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text material-symbols-outlined bg-light">phone</span>
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        className="form-control form-control-lg"
                                        placeholder="Tu teléfono"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            {/* Localización */}
                            <div className="mb-4">
                                <label htmlFor="localizacion" className="form-label fw-medium">Localización</label>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text material-symbols-outlined bg-light">place</span>
                                    <input
                                        type="text"
                                        id="localizacion"
                                        name="localizacion"
                                        className="form-control form-control-lg"
                                        placeholder="Ciudad, país"
                                        value={localizacion}
                                        onChange={(e) => setLocalizacion(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            {/* Descripción */}
                            <div className="mb-4">
                                <label htmlFor="descripcion" className="form-label fw-medium">Descripción</label>
                                <div>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        className="form-control form-control-lg"
                                        placeholder="Cuéntanos algo sobre ti"
                                        rows={3}
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mensajes de estado */}
                    {error && (
                        <div className="alert alert-danger" role="alert">{error}</div>
                    )}
                    {success && (
                        <div className="alert alert-success" role="alert">{success}</div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 fw-bold mb-3"
                        disabled={loading}
                    >
                        {loading && (
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        )}
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>

                    <div className="text-center small">
                        ¿Ya tienes cuenta? <a href="/login" className="text-primary text-decoration-none fw-medium">Inicia sesión</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegistroPage;