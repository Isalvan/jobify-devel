import { api } from "../utils/api";

export const companyService = {
    /**
     * Obtiene las empresas destacadas (con impresiones restantes).
     * @returns {Promise<Object>} Respuesta con datos de empresas
     */
    async getFeaturedCompanies() {
        return await api.get('/empresas/destacadas');
    },

    async getCompanies(params) {
        const query = params ? new URLSearchParams(params).toString() : '';
        return await api.get(`/empresas?${query}`);
    }
};
