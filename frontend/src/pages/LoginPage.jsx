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
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page d-flex align-items-center justify-content-center">
            <div className="login-container">
                <a href="/" className="volver btn btn-link top-0 start-0 m-3 text-decoration-none">
                    <span className="material-symbols-outlined text-primary">arrow_back</span> Volver al inicio
                </a>
                {/* Logo y bienvenida */}
                <div className="texto-bienvenida text-center mb-5">
                    <h1 className="display-5 fw-bold mb-2">Jobify</h1>
                    <p className="lead text-muted">Inicia sesión en tu cuenta</p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="mb-4">
                        <label htmlFor="email" className="form-label fw-medium">
                            Correo Electrónico
                        </label>
                        <div className="input-group input-group-lg">
                            <span className="input-group-text material-symbols-outlined bg-light">mail</span>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                autoComplete="username"
                                className="form-control form-control-lg"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                aria-required="true"
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label fw-medium">
                            Contraseña
                        </label>
                        <div className="input-group input-group-lg position-relative">
                            <span className="input-group-text material-symbols-outlined bg-light">lock</span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                autoComplete="current-password"
                                className="form-control form-control-lg"
                                placeholder="Tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                aria-required="true"
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

                    {/* Remember me y Forgot password */}
                    <div className="mb-4">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="remember"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                disabled={loading}
                            />
                            <label className="form-check-label" htmlFor="remember">
                                Recuérdame
                            </label>
                        </div>
                        <br />
                        <a href="/forgot-password" className="text-primary text-decoration-none small fw-medium">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    {/* Submit Button */}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 fw-bold mb-4"
                        disabled={loading}
                    >
                        {loading && (
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        )}
                        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;