import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import InicioPage from "../pages/InicioPage";
import LoginPage from "../pages/LoginPage";
import RegistroPage from "../pages/RegistroPage";
import PerfilPage from "../pages/PerfilPage";
import BusquedaPage from "../pages/BusquedaPage";
import DetallesOfertaPage from "../pages/DetallesOfertaPage";
import MisAplicacionesPage from '../pages/MisAplicacionesPage';
import MisFavoritosPage from '../pages/MisFavoritosPage';
import CrearOfertaPage from '../pages/CrearOfertaPage';
import JobApplicationsPage from '../pages/JobApplicationsPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ErrorBoundary from "../components/common/ErrorBoundary";
import NotFoundPage from "../pages/NotFoundPage";

/**
 * Devuelve el enrutador con todas las rutas del proyecto, tanto públicas como privadas
 * 
 * @returns {JSX.Element}
 */
function AppEnrutador() {
    return (
        <BrowserRouter>
            <ErrorBoundary>
                <Routes>
                    {/* Conjunto de rutas que usan el AppLayout */}
                    <Route path="/" element={<AppLayout />}>
                        {/* Rutas Públicas */}
                        <Route index element={<InicioPage />} />
                        <Route path="/ofertas" element={<BusquedaPage />} />
                        <Route path="/ofertas/:id" element={<DetallesOfertaPage />} />
                        {/* Perfil público (si tiene ID) */}
                        <Route path="/perfil/:id" element={<PerfilPage />} />

                        {/* Rutas Protegidas */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/perfil" element={<PerfilPage />} />
                            <Route path="/mis-aplicaciones" element={<MisAplicacionesPage />} />
                            <Route path="/favoritos" element={<MisFavoritosPage />} />
                            
                            {/* Rutas de Gestión de Ofertas (Empresa/Empleado) */}
                            <Route path="/crear-oferta" element={<CrearOfertaPage />} />
                            <Route path="/ofertas/:id/editar" element={<CrearOfertaPage />} />
                            <Route path="/ofertas/:id/aplicaciones" element={<JobApplicationsPage />} />
                            
                            {/* Admin */}
                            <Route path="/admin" element={<AdminDashboardPage />} />
                        </Route>
                    </Route>

                    {/* Login */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Registro */}
                    <Route path="/register" element={<RegistroPage />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </ErrorBoundary>
        </BrowserRouter>
    );
}

export default AppEnrutador;