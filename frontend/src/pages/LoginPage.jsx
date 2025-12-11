import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppProvider';
import './css/LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useContext(AppContext);
    const navigate = useNavigate();

    const handleSubmit = async function (e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password, remember);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page d-flex bg-light py-5" style={{minHeight: '100vh'}}>
            <div className="login-container card-premium p-5 shadow-lg" style={{maxWidth: '500px', width: '100%'}}>
                <a href="/" className="d-flex align-items-center mb-4 text-decoration-none text-muted small hover-primary">
                    <span className="material-symbols-outlined me-1" style={{fontSize: '18px'}}>arrow_back</span> Volver al inicio
                </a>
                
                {/* Logo y bienvenida */}
                <div className="text-center mb-4">
                    <h1 className="fw-bold mb-2 text-gradient display-6">Bienvenido</h1>
                    <p className="text-muted">Inicia sesión para continuar</p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="mb-4">
                        <label htmlFor="email" className="form-label fw-medium small text-muted">Correo Electrónico</label>
                        <div className="input-group-premium">
                            <span className="material-symbols-outlined text-primary ms-2">mail</span>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                autoComplete="username"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label fw-medium small text-muted">Contraseña</label>
                        <div className="input-group-premium">
                            <span className="material-symbols-outlined text-primary ms-2">lock</span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                autoComplete="current-password"
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

                    {/* Remember me y Forgot password */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="remember"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                disabled={loading}
                            />
                            <label className="form-check-label small text-muted" htmlFor="remember">
                                Recuérdame
                            </label>
                        </div>
                        <a href="/forgot-password" className="text-primary text-decoration-none small fw-medium">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    {/* Submit Button */}
                    {error && (
                        <div className="alert alert-danger py-2 small" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-premium w-100 justify-content-center py-3"
                        disabled={loading}
                    >
                        {loading && (
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        )}
                        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </button>
                </form>
                <div className="mt-4 pt-3 border-top">
                    <p className="small text-center text-muted mb-3 fw-bold">Acceso Rápido (Solo Desarrollo)</p>
                    <div className="d-flex gap-2 justify-content-center flex-wrap">
                        <button 
                            type="button" 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => { setEmail('usuario@jobify.com'); setPassword('password'); }}
                        >
                            Candidato
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => { setEmail('empresa@jobify.com'); setPassword('password'); }}
                        >
                            Empresa
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => { setEmail('empleado@jobify.com'); setPassword('password'); }}
                        >
                            Empleado
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => { setEmail('admin@jobify.com'); setPassword('password'); }}
                        >
                            Admin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;