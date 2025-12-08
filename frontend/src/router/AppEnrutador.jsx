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

/**
 * Devuelve el enrutador con todas las rutas del proyecto, tanto públicas como privadas
 * 
 * @returns {JSX.Element}
 */
function AppEnrutador() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Conjunto de rutas que usan el AppLayout */}
                <Route path="/" element={<AppLayout />}>
                    {/* Ruta de la página de inicio */}
                    <Route index element={<InicioPage />} />
                    <Route path="/perfil" element={<PerfilPage />} />
                    <Route path="/perfil/:id" element={<PerfilPage />} />
                    <Route path="/ofertas" element={<BusquedaPage />} />
                    <Route path="/ofertas/:id" element={<DetallesOfertaPage />} />
                    <Route path="/mis-aplicaciones" element={<MisAplicacionesPage />} />
                    <Route path="/favoritos" element={<MisFavoritosPage />} />
                </Route>

                {/* Login */}
                <Route path="/login" element={<LoginPage />} />

                {/* Registro */}
                <Route path="/register" element={<RegistroPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppEnrutador;