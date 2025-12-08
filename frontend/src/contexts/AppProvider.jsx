import { createContext, useEffect, useState } from "react";

// Creación del contexto
import { authService } from "../services/authService";

// Creación del contexto
const AppContext = createContext();

function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Aquí podríamos validar el token con el backend si hubiera un endpoint /me
            // Por ahora, asumimos que si hay token, intentamos persistir la sesión.
            // Si tuvieramos usuario en localStorage también lo podríamos cargar.
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setToken(data.access_token);
        setUser(data.user);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return data;
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        setToken(data.access_token);
        setUser(data.user);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return data;
    };

    const logout = async () => {
        try {
            await authService.logout(token);
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    };

    return (
        <AppContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };