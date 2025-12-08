
import { api } from "../utils/api";

export const authService = {
    async login(email, password) {
        return await api.post("/login", { email, password });
    },

    async register(userData) {
        return await api.post("/register", userData);
    },

    async logout(token) {
        return await api.post("/logout", {}, token);
    },
};