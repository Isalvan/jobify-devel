import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppProvider';
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

    const { register } = useContext(AppContext);
    const navigate = useNavigate();

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
            const payload = {
                name: nombre,
                email,
                password,
                password_confirmation: confirmPassword,
                apellidos,
                telefono,
                fecha_nacimiento: fechaNacimiento,
                descripcion,
                ubicacion: localizacion,
            };

            await register(payload);

            setSuccess('Cuenta creada correctamente.');
            setTimeout(() => {
                navigate('/');
            }, 1000);

        } catch (err) {
            setError(err.message || 'Error al crear la cuenta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registro-page d-flex align-items-center justify-content-center bg-light py-5" style={{minHeight: '100vh'}}>
            <div className="registro-container card-premium p-5 shadow-lg" style={{maxWidth: '900px', width: '100%'}}>
                <a href="/" className="d-flex align-items-center mb-4 text-decoration-none text-muted small hover-primary">
                    <span className="material-symbols-outlined me-1" style={{fontSize: '18px'}}>arrow_back</span> Volver al inicio
                </a>

                <div className="text-center mb-5">
                    <h1 className="fw-bold mb-2 text-gradient display-6">Crea tu cuenta</h1>
                    <p className="text-muted">Únete a Jobify y encuentra tu próximo empleo</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-medium small text-muted">Nombre <span className="text-danger">*</span></label>
                            <div className="input-group-premium">
                                <span className="material-symbols-outlined text-primary ms-2">person</span>
                                <input
                                    type="text"
                                    placeholder="Tu nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label fw-medium small text-muted">Apellidos <span className="text-danger">*</span></label>
                            <div className="input-group-premium">
                                <span className="material-symbols-outlined text-primary ms-2">badge</span>
                                <input
                                    type="text"
                                    placeholder="Tus apellidos"
                                    value={apellidos}
                                    onChange={(e) => setApellidos(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label fw-medium small text-muted">Email <span className="text-danger">*</span></label>
                            <div className="input-group-premium">
                                <span className="material-symbols-outlined text-primary ms-2">mail</span>
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                    title="Introduce un email válido (ej: usuario@dominio.com)"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label fw-medium small text-muted">Fecha de Nacimiento <span className="text-danger">*</span></label>
                            <div className="input-group-premium">
                                <span className="material-symbols-outlined text-primary ms-2">calendar_month</span>
                                <input
                                    type="date"
                                    value={fechaNacimiento}
                                    onChange={(e) => setFechaNacimiento(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label fw-medium small text-muted">Contraseña <span className="text-danger">*</span></label>
                            <div className="input-group-premium">
                                <span className="material-symbols-outlined text-primary ms-2">lock</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Tu contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-link text-decoration-none text-muted p-0 me-2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined" style={{fontSize: '20px'}}>
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label fw-medium small text-muted">Repetir Contraseña <span className="text-danger">*</span></label>
                            <div className="input-group-premium">
                                <span className="material-symbols-outlined text-primary ms-2">lock</span>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Repite tu contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-link text-decoration-none text-muted p-0 me-2"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <span className="material-symbols-outlined" style={{fontSize: '20px'}}>
                                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label fw-medium small text-muted">Teléfono</label>
                            <div className="input-group-premium">
                                <span className="material-symbols-outlined text-primary ms-2">phone</span>
                                <input
                                    type="tel"
                                    placeholder="Tu teléfono"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label fw-medium small text-muted">Localización <span className="text-danger">*</span></label>
                            <div className="input-group-premium">
                                <span className="material-symbols-outlined text-primary ms-2">place</span>
                                <input
                                    type="text"
                                    placeholder="Tu ciudad"
                                    value={localizacion}
                                    onChange={(e) => setLocalizacion(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-medium small text-muted">Descripción</label>
                            <div className="input-group-premium align-items-start">
                                <span className="material-symbols-outlined text-primary ms-2 mt-2">description</span>
                                <textarea
                                    className="form-control border-0 shadow-none"
                                    placeholder="Cuéntanos algo sobre ti"
                                    rows={3}
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    disabled={loading}
                                    style={{resize: 'none', background: 'transparent'}}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger mt-4" role="alert">{error}</div>
                    )}
                    {success && (
                        <div className="alert alert-success mt-4" role="alert">{success}</div>
                    )}

                    <div className="mt-4">
                        <button
                            type="submit"
                            className="btn-premium w-100 justify-content-center py-3"
                            disabled={loading}
                        >
                            {loading && (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            )}
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <span className="text-muted">¿Ya tienes cuenta? </span>
                        <a href="/login" className="text-primary text-decoration-none fw-bold">Inicia sesión</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegistroPage;