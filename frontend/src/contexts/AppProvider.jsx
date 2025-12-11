import { createContext, useEffect, useState } from "react";

import { authService } from "../services/authService";

const AppContext = createContext();

function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || sessionStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage first, then sessionStorage
        const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

        if (storedToken) {
            setToken(storedToken);
        }

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        
        setLoading(false);
    }, []);

    const login = async (email, password, remember = false) => {
        const data = await authService.login(email, password);
        setToken(data.access_token);
        setUser(data.user);

        if (remember) {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
        } else {
            sessionStorage.setItem("token", data.access_token);
            sessionStorage.setItem("user", JSON.stringify(data.user));
        }
        
        return data;
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        setToken(data.access_token);
        setUser(data.user);
        // Default to localStorage for registration for better UX, or could be session.
        // Let's stick to session for consistency if not specified, but usually registration implies login.
        // For now, let's use localStorage to be safe/stick to previous behavior, or session?
        // Let's use localStorage as it was default before.
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return data;
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        // Update wherever it exists
        if (localStorage.getItem("user")) {
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        if (sessionStorage.getItem("user")) {
            sessionStorage.setItem("user", JSON.stringify(updatedUser));
        }
    };

    const logout = async () => {
        try {
            await authService.logout(token);
        } catch (error) {
            if (error.message !== "Unauthenticated.") {
                console.error("Logout warning:", error);
            }
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
        }
    };

    return (
        <AppContext.Provider value={{ user, token, login, register, logout, loading, updateUser }}>
            {children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };