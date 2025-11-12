import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import InicioPage from "../pages/InicioPage";
import LoginPage from "../pages/LoginPage";

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
                </Route>

                {/* Login */}
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppEnrutador;