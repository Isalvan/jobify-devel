import { api } from "../utils/api";

export const jobService = {
    async getJobs(filters = {}) {
        const params = new URLSearchParams(filters);
        return await api.get(`/trabajos?${params.toString()}`);
    },

    async getTopRated() {
        return await api.get('/trabajos/mejores-valorados');
    },

    async getJob(id) {
        return await api.get(`/trabajos/${id}`);
    },

    async toggleFavorite(jobId) {
        return await api.post('/favoritos/toggle', { trabajo_id: jobId });
    },

    async getFavorites() {
        return await api.get('/favoritos');
    }
};
