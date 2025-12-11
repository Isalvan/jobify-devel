import { api } from "../utils/api";

export const jobService = {
    async getJobs(filters = {}) {
        // Asegurar que page esté presente
        const params = new URLSearchParams(filters);
        return await api.get(`/trabajos?${params.toString()}`);
    },

    async getLocations() {
        return await api.get('/ubicaciones');
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
    },

    async createJob(jobData) {
        return await api.post('/trabajos', jobData);
    },

    async updateJob(id, jobData) {
        return await api.put(`/trabajos/${id}`, jobData);
    },

    async deleteJob(id) {
        return await api.delete(`/trabajos/${id}`);
    }
};
