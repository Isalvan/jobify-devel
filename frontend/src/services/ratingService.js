import { api } from "../utils/api";

export const ratingService = {
    /**
     * Crea una nueva valoración para un trabajo.
     * @param {Object} data - { trabajo_id, puntuacion, comentario }
     * @returns {Promise<Object>}
     */
    async createRating(data) {
        return await api.post('/valoraciones', data);
    },

    async getJobRatings(jobId, page = 1) {
        return await api.get(`/trabajos/${jobId}/valoraciones?page=${page}`);
    },

    async deleteRating(id) {
        return await api.delete(`/valoraciones/${id}`);
    }
};
